import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkIs8cUvn5e7-PcnsfUZV3jKwqIouxmsU",
  authDomain: "club-de-lectura-unprg.firebaseapp.com",
  projectId: "club-de-lectura-unprg",
  storageBucket: "club-de-lectura-unprg.appspot.com",
  messagingSenderId: "873692669008",
  appId: "1:873692669008:web:d7988a9340268c28e35d55",
  measurementId: "G-SBXWBRJY3L",
};

export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
