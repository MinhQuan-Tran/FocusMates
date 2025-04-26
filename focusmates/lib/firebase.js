/*
// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
//import { getAuth, connectAuthEmulator }  from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

/*
const firebaseConfig = {
  projectId:           process.env.focusmates,
  apiKey:              process.env.AIzaSyBWYV6XOftoYlJQ5Io6Ygv5ksvXhh_SjlA,
  authDomain:          process.env.focusmates.firebaseapp.com,
  databaseURL:         process.env.https://focusmates-default-rtdb.asia-southeast1.firebasedatabase.app,
  storageBucket:       process.env.focusmates.firebasestorage.app,
  messagingSenderId:   process.env.290251176737,
  appId:               process.env.1:290251176737:web:fb591e5b98b8014269dc60,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db   = getFirestore(app);

// In emulator mode (no-op if emulators aren’t running)
if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth,    "http://127.0.0.1:9099", { disableWarnings: true });
}
*/
/*
const firebaseConfig = {
  projectId: "focusmates",
  apiKey: "local", 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

connectFirestoreEmulator(db, "127.0.0.1", 8080);
*/
/*
// Only connect to emulator when running locally or from a script
if (process.env.NODE_ENV !== "production") {
  connectFirestoreEmulator(db, "localhost", 8080);
  // connectAuthEmulator(auth, "http://localhost:9099"); // if needed
}


export { db };

*/

import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  projectId: "focusmates", // must match your emulator project
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 👇 Connect to Firestore emulator
connectFirestoreEmulator(db, "127.0.0.1", 8080);

export { db };
