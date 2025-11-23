// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEnv } from './getEnv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "mern-blog-a2bba.firebaseapp.com",
  projectId: "mern-blog-a2bba",
  storageBucket: "mern-blog-a2bba.firebasestorage.app",
  messagingSenderId: "930152208589",
  appId: "1:930152208589:web:278eaf7b7458d7ebd27184"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}