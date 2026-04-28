import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBP2E-TIPkCnQ022TSuiA1w0eZI-k8907k",
  authDomain: "mafer-fe624.firebaseapp.com",
  projectId: "mafer-fe624",
  storageBucket: "mafer-fe624.firebasestorage.app",
  messagingSenderId: "22974404357",
  appId: "1:22974404357:web:7f2b8924925903d63e896c",
  measurementId: "G-J8STTE5BP2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);