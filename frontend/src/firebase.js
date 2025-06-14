import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAbpVCQ7u-2oYpeR7yeFNbTCrO-f32L6k",
  authDomain: "the-nest-1da19.firebaseapp.com",
  projectId: "the-nest-1da19",
  storageBucket: "the-nest-1da19.firebasestorage.app",
  messagingSenderId: "50043851612",
  appId: "1:50043851612:web:330d75df45cbb8642be799",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);