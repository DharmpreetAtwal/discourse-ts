import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserInfo } from "../interfaces/types";

const useGetUserInfo = () => {
  const getUserInfo = async (userID: string): Promise<UserInfo> => {
    const userDoc = doc(db, "users", userID);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      let userInfo: UserInfo = {
        uid: userID,
        displayName: userSnapshot.data().displayName,
        photoURL: userSnapshot.data().photoURL,
        friends: userSnapshot.data().friends,
        pendingFriends: userSnapshot.data().pendingFriends,
        email: userSnapshot.data().email,
        privateGroups: userSnapshot.data().privateGroups,
      };

      return userInfo;
    }

    return {
      uid: "",
      displayName: "NULL",
      photoURL: "NULL",
      email: "",
      friends: [],
      pendingFriends: [],
      privateGroups: [],
    };
  };

  return { getUserInfo };
};

export default useGetUserInfo;
