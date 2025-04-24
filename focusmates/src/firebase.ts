// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWYV6XOftoYlJQ5Io6Ygv5ksvXhh_SjlA",
  authDomain: "focusmates.firebaseapp.com",
  projectId: "focusmates",
  storageBucket: "focusmates.firebasestorage.app",
  messagingSenderId: "290251176737",
  appId: "1:290251176737:web:fb591e5b98b8014269dc60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Ldq_iIrAAAAABzkCR0ASLL7u5QfVW8AMbVpALPN"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});
