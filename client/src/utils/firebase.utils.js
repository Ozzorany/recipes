import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3V3XmPwu2wngw37lOoSOZZIDSvAlMkSs",
  authDomain: "recipes-e6692.firebaseapp.com",
  projectId: "recipes-e6692",
  storageBucket: "recipes-e6692.appspot.com",
  messagingSenderId: "839606146057",
  appId: "1:839606146057:web:ec8b4f2d6e283d5b7254d8",
  measurementId: "G-JM0K7NJ5XL",
};
initializeApp(firebaseConfig);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: "select_account ",
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const additionalUserInfo = (result) => getAdditionalUserInfo(result);
export const db = getFirestore();
