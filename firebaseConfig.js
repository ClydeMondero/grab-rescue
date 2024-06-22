// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlx9E2-kWAoWF49APPmrVrUDlVDWC39yY",
  authDomain: "grab-rescue.firebaseapp.com",
  projectId: "grab-rescue",
  storageBucket: "grab-rescue.appspot.com",
  messagingSenderId: "160564090046",
  appId: "1:160564090046:web:d46f7d3265575daad1faef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize  Firebase Authentication and get a reference to the service
// const auth = getAuth(app);

export default app;
