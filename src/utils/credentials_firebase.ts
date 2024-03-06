// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// TODO: Colocar en .env las credenciales de firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuh5E9hbVCaWn4dBh2LIBAqxUPBEygluo",
  authDomain: "clinica-internacional-41a58.firebaseapp.com",
  projectId: "clinica-internacional-41a58",
  storageBucket: "clinica-internacional-41a58.appspot.com",
  messagingSenderId: "731195266634",
  appId: "1:731195266634:web:821464eccd3f765224b8b3",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
