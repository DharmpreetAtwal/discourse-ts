import { createContext, useState } from "react";
import { Auth } from "./components/Auth";
import { Home } from "./components/home/Home";
import { Group } from "./components/group/Group";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

const cookies = new Cookies();

type UserIDContextType = {
  userID: string;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
};

export const UserIDStateContext = createContext<UserIDContextType>(
  null as unknown as UserIDContextType
);

function App() {
  const [userID, setUserID] = useState<string>(cookies.get("uid"));
  const value = { userID, setUserID };

  const [displayName, setDisplayName] = useState<string | null>("");
  const [photoURL, setPhotoURL] = useState<string | null>("");

  // A function that adds an attribute to all docs in user collection
  /*useEffect(() => {
    (async () => {
      const docSnapshot = await getDocs(collection(db, "users"));
      docSnapshot.forEach((docC) => {
        const docRef = doc(db, "users/" + docC.id);
        console.log(docRef);
        updateDoc(docRef, {
          isOnline: false,
        });
      });
    })();
  });*/

  return (
    <>
      <UserIDStateContext.Provider value={value}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Auth
                  setDisplayName={setDisplayName}
                  setPhotoURL={setPhotoURL}
                />
              }
            ></Route>
            <Route
              path="home"
              element={<Home displayName={displayName} photoURL={photoURL} />}
            ></Route>
            <Route
              path="group/:groupID"
              element={<Group isPrivate={false} />}
            />
            <Route
              path="privateGroup/:groupID/:friendID"
              element={<Group isPrivate={true} />}
            />
          </Routes>
        </Router>
      </UserIDStateContext.Provider>
    </>
  );
}

export default App;
