// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvckCVa4-2mxBJk5N7UbuW6NZRaeCYYEU",
  authDomain: "helpdesk-4879e.firebaseapp.com",
  projectId: "helpdesk-4879e",
  storageBucket: "helpdesk-4879e.appspot.com",
  messagingSenderId: "860161064134",
  appId: "1:860161064134:web:2ed029a25a0eac86feebc7",
  measurementId: "G-QW22V85FXV"
};

if(!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // getAnalytics(app);
}

export default firebase;