// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnuj77L5_V6YLspOLVdSb0KpIMztGVzO0",
  authDomain: "toto-ade04.firebaseapp.com",
  projectId: "toto-ade04",
  storageBucket: "toto-ade04.appspot.com",
  messagingSenderId: "952805481014",
  appId: "1:952805481014:android:98e7cf6b8a4cf174f69697",
};

// ✅ This check prevents multiple initializations (important in Expo/React Native)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
