import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 


const firebaseConfig = {
    apiKey: "AIzaSyAth6f96L53ljR42GnztLE_1B4jyZUe-dg",
    authDomain: "mockingbird-b2ea3.firebaseapp.com",
    databaseURL: "https://mockingbi-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "mockingbird-b2ea3",
    storageBucket: "mockingbird-b2ea3.appspot.com",
    messagingSenderId: "675902116896",
    appId: "1:675902116896:web:ba3dff5bc01f884c779845",
    measurementId: "G-F38SFNZWMF"
    
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
    
export { database };
