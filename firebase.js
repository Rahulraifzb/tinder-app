// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth
} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4mu9xKPPZa-1BW7HncVWQSYL04dRU0F8",
  authDomain: "tinder-app-13042.firebaseapp.com",
  projectId: "tinder-app-13042",
  storageBucket: "tinder-app-13042.appspot.com",
  messagingSenderId: "624492323123",
  appId: "1:624492323123:web:a805c8cab9653c8efc9e46",
  measurementId: "G-VQTF8EZ65D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore()

export {app,auth,db}