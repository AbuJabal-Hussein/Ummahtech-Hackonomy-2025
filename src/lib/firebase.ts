// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "barakah-ledger.firebaseapp.com",
    projectId: "barakah-ledger",
    storageBucket: "barakah-ledger.firebasestorage.app",
    messagingSenderId: "723326182698",
    appId: "1:723326182698:web:2a864d791a36e95f2e2a53",
    measurementId: "G-CJG4HV6YCZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
