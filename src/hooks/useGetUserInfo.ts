import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserInfo } from "../interfaces/types";

const useGetUserInfo = () => {
  const getUserInfo = async (userID: string): Promise<UserInfo> => {
    const userDoc = doc(db, "users", userID);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      let userInfo = {
        uid: userID,
        displayName: userSnapshot.data().displayName,
        photoURL: userSnapshot.data().photoURL,
      };

      return userInfo;
    }

    return {
      uid: null,
      displayName: "NULL",
      photoURL: "NULL",
    };
  };

  return { getUserInfo };
};

export default useGetUserInfo;
