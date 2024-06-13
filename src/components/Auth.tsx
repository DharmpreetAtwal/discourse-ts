import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db, providerGoogleAuth, rtDB } from "../config/firebase";
import { onDisconnect, ref } from "firebase/database";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import Cookies from "universal-cookie";
import { useSetIsOnline } from "../hooks/friend/useSetIsOnline";
import { FC } from "react";
import { AuthProps } from "../interfaces/types";

// const cookies = new Cookies();

export const Auth: FC<AuthProps> = ({
  setIsAuth,
  setUserID,
  setDisplayName,
  setPhotoURL,
}) => {
  const navigate = useNavigate();
  const { setIsOnline } = useSetIsOnline();

  const signInGoogle = async () => {
    try {
      const info = await signInWithPopup(auth, providerGoogleAuth);
      info.user.displayName;
      //cookies.set("token-auth", info.user.refreshToken);
      //cookies.set("uid", info.user.uid);

      setIsAuth(true);
      setUserID(info.user.uid);
      setDisplayName(info.user.displayName);
      setPhotoURL(info.user.photoURL);

      const docRef = doc(db, "users", info.user.uid);
      const docSnap = await getDoc(docRef);

      /* 
        Two cases needed, one where user already exists and they need 
        a new attribute added, or the user is new, all attributes are 
        created fresh. 

        A seperate useEffect exists in App.jsx to add an attribute to all 
        docs in user collection 
      */
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          pendingFriends: arrayUnion(),
          displayName: info.user.displayName,
          photoURL: info.user.photoURL,
        });
      } else {
        await setDoc(docRef, {
          email: info.user.email,
          pendingFriends: [],
          friends: [],
          displayName: info.user.displayName,
          photoURL: info.user.photoURL,
        });
      }

      setIsOnline(docRef.id, true);

      // Reset isOnline and openGroup upon disconnect
      const userIsOnlineRef = ref(rtDB, docRef.id + "/isOnline");
      const userOpenGroupRef = ref(rtDB, docRef.id + "/openGroup");
      onDisconnect(userIsOnlineRef).set(false);
      onDisconnect(userOpenGroupRef).set("");
    } catch (err) {
      console.error(err);
    }

    navigate("/home");
  };

  return (
    <div>
      <button className="bg-purple-500" onClick={signInGoogle}>
        {" "}
        Sign in Google{" "}
      </button>
    </div>
  );
};
