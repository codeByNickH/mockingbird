const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { getAuth, GoogleAuthProvider } = require("firebase/auth");

const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const firebaseConfig = {
    apiKey: key,
    authDomain: "mockingbi.firebaseapp.com",
    databaseURL: "https://mockingbi-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mockingbi",
    storageBucket: "mockingbi.appspot.com",
    messagingSenderId: "657216447867",
    appId: "1:657216447867:web:558267c4375565eb6b89de",
    measurementId: "G-MQ2R0JF4DE"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

module.exports = { database, auth, provider };