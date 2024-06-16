import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db, providerGoogleAuth, rtDB } from "../config/firebase";
import { onDisconnect, ref } from "firebase/database";
import { User, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useSetIsOnline } from "../hooks/friend/useSetIsOnline";
import { FC, useContext, useEffect } from "react";
import { ReactSVG } from "./ReactSVG";
import { FirebaseSVG } from "./FirebaseSVG";
import { TypeScriptSVG } from "./TypeScriptSVG";
import { UserIDStateContext } from "../App";
import { GitHubSVG } from "./GitHubSVG";

const cookies = new Cookies();

export const Auth: FC = () => {
  const { setUser } = useContext(UserIDStateContext);
  const navigate = useNavigate();
  const { setIsOnline } = useSetIsOnline();

  useEffect(() => {
    const userCookie: User = cookies.get("user");

    if (userCookie !== undefined) {
      setUser(userCookie);
      navigate("/home", { replace: true });
    }
  }, []);

  const signInGoogle = async () => {
    try {
      const info = await signInWithPopup(auth, providerGoogleAuth);
      cookies.set("user", info.user);

      setUser(info.user);

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
    <div className="flex flex-col h-screen w-screen bg-orange-400 items-center justify-center">
      <div className="flex flex-col w-1/2 h-3/4 items-center justify-center bg-orange-600 rounded-3xl">
        <h1 className="flex items-center justify-center text-7xl text-cyan-300 bg-indigo-800 w-fill h-20 px-6 rounded-2xl">
          {" "}
          Discourse{" "}
        </h1>
        {/*<h1 className="flex flex-row text-white text-3xl mt-2 justify-center items-center">
          {" "}
          The{" "}
          <h2 className="justify-center items-center rounded-3xl w-fit px-4 bg-red-500 border-white border-0 text-white space-x-1">
            <p className="flex justify-center items-center">Real-Time</p>{" "}
          </h2>{" "}
          Chatting App
        </h1>*/}
        <div className="flex flex-row space-x-1 mt-1">
          <h1 className=" text-white text-3xl mt-2 justify-center items-center">
            {" "}
            The{" "}
          </h1>
          <h2 className="flex justify-center items-center text-3xl rounded-3xl w-fit px-4 bg-red-500 border-white border-0 text-white">
            Real-Time
          </h2>{" "}
          <h1 className=" text-white text-3xl mt-2 justify-center items-center">
            {" "}
            Chatting App{" "}
          </h1>
        </div>

        <div className="text-white text-5xl flex flex-row items-center justify-center space-x-1 mt-3">
          <h1 className="text-3xl"> Made using: </h1>
          <div className="flex justify-center items-center space-x-2">
            <ReactSVG /> <p> + </p> <TypeScriptSVG /> <p> + </p> <FirebaseSVG />
          </div>
        </div>
        <a href="https://github.com/DharmpreetAtwal">
          <div className="flex flex-row bg-zinc-100 hover:bg-slate-300 rounded-xl items-center space-x-1 px-2 py-1 mt-2 mb-16 shadow-2xl">
            <h2 className="text-xl text-zinc-800">Dharmpreet Atwal</h2>
            <GitHubSVG />
          </div>
        </a>

        <button onClick={signInGoogle} className="gsi-material-button">
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="block"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
              Sign in with Google
            </span>
            <span className="hidden">Sign in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
};
