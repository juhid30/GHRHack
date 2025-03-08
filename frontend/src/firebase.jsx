// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore , collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBDop4Q3hioOn9b5V9sSAzSlm6zb_LThc",
  authDomain: "scam-ebe3b.firebaseapp.com",
  projectId: "scam-ebe3b",
  storageBucket: "scam-ebe3b.firebasestorage.app",
  messagingSenderId: "167723287450",
  appId: "1:167723287450:web:f908bd2a68ecbe196df023",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const storage = getStorage(app);

export { realtimeDb, db, storage, app, collection, addDoc };
