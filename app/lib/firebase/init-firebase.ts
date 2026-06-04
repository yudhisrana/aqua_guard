// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFDGHVxbhRQ3n-lOpw0bUGi8kf3I73uhw",
  authDomain: "aquaguard-1c198.firebaseapp.com",
  databaseURL:
    "https://aquaguard-1c198-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aquaguard-1c198",
  storageBucket: "aquaguard-1c198.firebasestorage.app",
  messagingSenderId: "121962297159",
  appId: "1:121962297159:web:fe08044176d35c07fcbe62",
  measurementId: "G-DXB82EEEBT",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export { app }
