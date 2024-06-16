import { createContext, useState } from "react";
import { Auth } from "./components/Auth";
import { Home } from "./components/home/Home";
import { Group } from "./components/group/Group";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import { User } from "firebase/auth";

const cookies = new Cookies();

type UserIDContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export const UserIDStateContext = createContext<UserIDContextType>(
  null as unknown as UserIDContextType
);

function App() {
  const [user, setUser] = useState<User>(cookies.get("user"));
  const value = { user, setUser };

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
            <Route path="/" element={<Auth />}></Route>
            <Route path="home" element={<Home />}></Route>
            <Route
              path="group/:groupID"
              element={<Group isPrivate={false} />}
            />
            <Route
              path="privateGroup/:groupID/:friendID"
              element={<Group isPrivate={true} />}
            />
            <Route path="*" element={<Auth />}></Route>
          </Routes>
        </Router>
      </UserIDStateContext.Provider>
    </>
  );
}

export default App;
