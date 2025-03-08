import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { openDB } from "idb"; // Import IndexedDB helper
import { app } from "../firebase";
import { Pen, FileText, User } from "lucide-react";

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
      const fileURL = await storeFile(name, file);
      setFormData({ ...formData, [name]: file.name });
      setLocalFiles({ ...localFiles, [name]: fileURL });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        profilePic: formData.profilePic, // Stored file name
        resume: formData.resume, // Stored file name
        knows: formData.knows,
        wantsToBe: formData.wantsToBe,
      });

      alert("Registration successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex mx-auto min-h-[100vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {localFiles.profilePic && (
            <img
              src={localFiles.profilePic}
              alt="Profile Preview"
              className="w-20 h-20 mt-2 rounded"
            />
          )}
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {localFiles.resume && (
            <p className="mt-2 text-sm text-gray-600">
              Resume uploaded: {formData.resume}
            </p>
          )}
          <input
            type="text"
            name="knows"
            placeholder="What do you know? (e.g. React, Node.js)"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="wantsToBe"
            placeholder="What do you want to be? (e.g. Full Stack Developer)"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
