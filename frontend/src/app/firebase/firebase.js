import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "firebase_key",
  authDomain: "np-datahub.firebaseapp.com",
  projectId: "np-datahub",
  storageBucket: "np-datahub.appspot.com",
  messagingSenderId: "164471389958",
  appId: "1:164471389958:web:19144e9df8397ac7e4e887",
  measurementId: "G-SH9MTET294"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth };
