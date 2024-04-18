// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxqPNzldvFBBAFFhWFm7bzRxk89AFv1Kc",
  authDomain: "furniturewebsite-42a50.firebaseapp.com",
  projectId: "furniturewebsite-42a50",
  storageBucket: "furniturewebsite-42a50.appspot.com",
  messagingSenderId: "406891294328",
  appId: "1:406891294328:web:3f9e6c0ab9210e3ed3478d",
  measurementId: "G-JXBDJB6Y5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth }