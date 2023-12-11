import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyvDdp7czRzWe2pPRoS-1KcA5S0dQxgB4",
  authDomain: "jobee-e1745.firebaseapp.com",
  projectId: "jobee-e1745",
  storageBucket: "jobee-e1745.appspot.com",
  messagingSenderId: "1038559977891",
  appId: "1:1038559977891:web:29444364c5a7a85d1eba16",
  measurementId: "G-9KRS9RQV5H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);


const provider= new GoogleAuthProvider()

export const signInnWithGooogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const name=result.user.displayName?.split(' ') as string[]
    const data = {
      firstName:name[0] ? name[0] :'',
      lastName:name[1] ? name[1] :'',
      username: result.user.displayName,
      email: result.user.email as string,
      password: result.user.uid
    };
    return data;
  } catch (err) {
    throw new Error("cannot signup with google right now")
  }
};
