import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import {
   getFirestore,
   collection,
   addDoc,
   serverTimestamp,
   onSnapshot,
   query,
   orderBy,
} from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBIii_x-lIi1FVTI32PFNKof16MJHhJNDU",
   authDomain: "cn-chat-app.firebaseapp.com",
   projectId: "cn-chat-app",
   storageBucket: "cn-chat-app.appspot.com",
   messagingSenderId: "641607640766",
   appId: "1:641607640766:web:75d3dd75e9270cf0abe0ef",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loginWithGoogle() {
   try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      const { user } = await signInWithPopup(auth, provider);

      return { uid: user.uid, displayName: user.displayName };
   } catch (error) {
      if (error.code !== "auth/cancelled-popup-request") {
         console.error(error);
      }
      return null;
   }
}

async function sendMessage(roomId, user, text) {
   try {
      await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
         uid: user.uid,
         displayName: user.displayName,
         text: text.trim(),
         timestamp: serverTimestamp(),
      });
   } catch (error) {
      console.error(error);
   }
}

function getMessages(roomId, callback) {
   return onSnapshot(
      query(
         collection(db, "chat-rooms", roomId, "messages"),
         orderBy("timestamp", "asc")
      ),
      (querySnapshot) => {
         const messages = querySnapshot.docs.map((x) => ({
            id: x.id,
            ...x.data(),
         }));

         callback(messages);
      }
   );
}

export { loginWithGoogle, sendMessage, getMessages };
