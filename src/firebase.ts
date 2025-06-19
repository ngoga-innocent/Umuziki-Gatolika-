import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getDatabase} from 'firebase/database'
const firebaseConfig = {
  apiKey: "AIzaSyCLO3RKUG2pJc-KY8EXiMIx3o4b2pvzHQA",
  authDomain: "umuziki-gatorika.firebaseapp.com",
  projectId: "umuziki-gatorika",
  storageBucket: "umuziki-gatorika.firebasestorage.app",
  messagingSenderId: "379536603244",
  appId: "1:379536603244:web:a48ae2cdb2905eb4680049",
  measurementId: "G-LVKNT8QE8Y"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realdb=getDatabase(app)
export const storage=getStorage(app)