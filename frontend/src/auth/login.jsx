import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app, db } from "../firebase"; // Ensure Firebase is initialized
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const auth = getAuth(app);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store user info in localStorage
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: userData.profilePic,
          resumeURL: userData.resume,
          knows: userData.knows,
          wantsToBe: userData.wantsToBe,
        })
      );

      alert("Login successful!");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex mx-auto min-h-[100vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-[#E0EAF8] to-[#F0F4F8]">
      <div className="max-w-[900px] mx-auto p-8 bg-white rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105">
        <div className="sm:mx-auto w-full ">
          <h2 className="mt-10 text-center text-3xl font-semibold text-indigo-800 tracking-tight">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border-2 border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 shadow-md focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border-2 border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 shadow-md focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-500 hover:scale-105 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
