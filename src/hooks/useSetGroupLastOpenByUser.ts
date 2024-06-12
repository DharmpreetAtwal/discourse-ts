import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { GroupData, LastOpenByUser } from "../interfaces/types";

const useSetGroupLastOpenByUser = () => {
  const findUserIndex = (
    userID: string,
    lastOpenedByUserMap: LastOpenByUser[] | undefined
  ): number => {
    let index = -1;
    if (lastOpenedByUserMap) {
      lastOpenedByUserMap.forEach((user, i) => {
        if (user.userID === userID) {
          index = i;
        }
      });
    }

    return index;
  };

  const setGroupLastOpenByUser = (userID: string, groupID: string) => {
    const groupDoc = doc(db, "groups", groupID);
    (async () => {
      const data: GroupData = (await getDoc(groupDoc)).data() as GroupData;

      if (data) {
        const lastOpenedByUserMap: LastOpenByUser[] | undefined =
          data.lastOpenedByUser;

        if (lastOpenedByUserMap) {
          const index = findUserIndex(userID, lastOpenedByUserMap);
          if (index >= 0) {
            lastOpenedByUserMap[index].lastOpened = Timestamp.now();

            await updateDoc(groupDoc, {
              lastOpenedByUser: lastOpenedByUserMap,
            });
          }
        }
      }
    })();
  };

  return { setGroupLastOpenByUser };
};

export default useSetGroupLastOpenByUser;
