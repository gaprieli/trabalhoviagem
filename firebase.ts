import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyB7sMayx6BwscCPb1OIXExHHNkZVRBL4Oo",
  authDomain: "aulayay.firebaseapp.com",
  projectId: "aulayay",
  storageBucket: "aulayay.firebasestorage.app",
  messagingSenderId: "799183413564",
  appId: "1:799183413564:web:338d79d8f3fead410dfe39"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };