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

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-900  border-2 border-black placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300  border-2 border-black placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
