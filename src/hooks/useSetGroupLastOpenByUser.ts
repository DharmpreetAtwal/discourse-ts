import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const useSetGroupLastOpenByUser = () => {
  const setGroupLastOpenByUser = (userID: string, groupID: string) => {
    const groupDoc = doc(db, "groups", groupID);
    (async () => {
      const snapshot = await getDoc(groupDoc);
      const lastOpenedByUserMap = snapshot.data().lastOpenedByUser;
      if (lastOpenedByUserMap) {
        lastOpenedByUserMap[userID] = serverTimestamp();
      }

      await updateDoc(groupDoc, {
        lastOpenedByUser: lastOpenedByUserMap,
      });
    })();
  };

  return { setGroupLastOpenByUser };
};

export default useSetGroupLastOpenByUser;
