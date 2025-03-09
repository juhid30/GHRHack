import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { openDB } from "idb";
import { app } from "../firebase";
import {
  Pen,
  FileText,
  User,
  Mail,
  Lock,
  Upload,
  Code,
  Briefcase,
  Home,
  LogIn,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    resume: null,
    knows: "",
    wantsToBe: "",
  });
  const [localFiles, setLocalFiles] = useState({
    profilePic: null,
    resume: null,
  });
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Open IndexedDB database
  const initDB = async () => {
    return openDB("UserFilesDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "name" });
        }
      },
    });
  };

  // Store file in IndexedDB
  const storeFile = async (name, file) => {
    const db = await initDB();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = async (e) => {
        await db.put("files", { name, data: e.target.result });
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle file input
  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        const fileURL = await storeFile(name, file);
        setFormData({ ...formData, [name]: file.name });
        setLocalFiles({ ...localFiles, [name]: fileURL });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConsent(true);
  };

  const proceedWithRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName: formData.name });

      // Save user data to Firestore with file names
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        profilePic: formData.profilePic,
        resume: formData.resume,
        knows: formData.knows,
        wantsToBe: formData.wantsToBe,
      });

      alert("Registration successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex mx-auto min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <User size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-indigo-600">
          Create an account
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Join our community and start your journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="md:flex md:space-x-4 space-y-5 md:space-y-0">
              <div className="md:w-1/2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John Doe"
                    required
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border border-gray-200 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-1/2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    required
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border border-gray-200 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="md:flex md:space-x-4 space-y-5 md:space-y-0">
              <div className="md:w-1/2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    required
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border border-gray-200 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-1/2">
                <label
                  htmlFor="knows"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Skills & Expertise
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Code className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="knows"
                    id="knows"
                    placeholder="React, Node.js, TypeScript, etc."
                    required
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border border-gray-200 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="md:flex md:space-x-4 space-y-5 md:space-y-0">
              <div className="md:w-1/2">
                <label
                  htmlFor="wantsToBe"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Career Goal
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="wantsToBe"
                    id="wantsToBe"
                    placeholder="Full Stack Developer, UI/UX Designer, etc."
                    required
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border border-gray-200 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:w-1/2">{/* Empty div for alignment */}</div>
            </div>

            <div className="md:flex md:space-x-4 space-y-5 md:space-y-0">
              <div className="md:w-1/2">
                <label
                  htmlFor="profilePic"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Picture
                </label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    {localFiles.profilePic ? (
                      <div className="relative">
                        <img
                          src={localFiles.profilePic}
                          alt="Profile Preview"
                          className="w-24 h-24 object-cover rounded-full border-4 border-indigo-100"
                        />
                        <div className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-1">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="profilePic"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                        <input
                          id="profilePic"
                          name="profilePic"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Resume / CV
                </label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    {localFiles.resume ? (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
                        <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm text-gray-700 truncate">
                          {formData.resume}
                        </span>
                        <div className="ml-auto">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            your resume
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF files up to 10MB
                          </p>
                        </div>
                        <input
                          id="resume"
                          name="resume"
                          type="file"
                          className="hidden"
                          accept="application/pdf"
                          onChange={handleChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="/"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                <Home className="h-5 w-5 mr-2 text-gray-500" />
                <span>Home</span>
              </a>
              <a
                href="/login"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                <LogIn className="h-5 w-5 mr-2 text-gray-500" />
                <span>Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-xl">
            <div className="text-center mb-4">
              <CheckCircle className="mx-auto h-12 w-12 text-indigo-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Data Processing Consent
              </h3>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                By proceeding, you agree that we may collect and use your
                personal data provided in this form for:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Account Management
                  </h4>
                  <ul className="list-disc text-sm text-gray-500 ml-5 space-y-1">
                    <li>Creating and managing your user profile</li>
                    <li>Authentication and security measures</li>
                    <li>Account notifications and updates</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Personalization
                  </h4>
                  <ul className="list-disc text-sm text-gray-500 ml-5 space-y-1">
                    <li>Customizing your platform experience</li>
                    <li>Matching you with relevant opportunities</li>
                    <li>Providing personalized recommendations</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Service Improvement
                  </h4>
                  <ul className="list-disc text-sm text-gray-500 ml-5 space-y-1">
                    <li>Analyzing user behavior and preferences</li>
                    <li>Enhancing our platform features</li>
                    <li>Testing and developing new services</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Communication
                  </h4>
                  <ul className="list-disc text-sm text-gray-500 ml-5 space-y-1">
                    <li>Sending important service notifications</li>
                    <li>Providing updates on new features</li>
                    <li>Contacting you regarding your account</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We will handle your data in accordance with our privacy policy.
                You may withdraw your consent at any time by contacting our
                support team.
              </p>
            </div>
            <div className="mt-6 sm:mt-6 flex gap-3">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={() => setShowConsent(false)}
              >
                Decline
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={() => {
                  setConsentGiven(true);
                  setShowConsent(false);
                  proceedWithRegistration();
                }}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
