import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAVICcaG1U-OoFWGHB9RvU0KQA52qrlNWA",
  authDomain: "tasks-5dfce.firebaseapp.com",
  projectId: "tasks-5dfce",
  storageBucket: "tasks-5dfce.appspot.com",
  messagingSenderId: "1058283907406",
  appId: "1:1058283907406:web:460392a7355e09b08bd61f",
  measurementId: "G-E3EDMB4BZ7"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {
    auth,
    db,
    storage
}

