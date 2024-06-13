import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { LastOpenByUser } from "../../interfaces/types";

export const useCreatePrivateGroup = () => {
  const groupCollectionRef = collection(db, "groups");

  const createPrivateGroup = async (userID: string, friendID: string) => {
    let membersArray = [userID, friendID];
    const lastOpenedByUserMap: LastOpenByUser[] = [
      { userID: userID, lastOpened: Timestamp.now() },
    ];
    const promise = await addDoc(groupCollectionRef, {
      creatorID: userID,
      members: membersArray,
      isPrivate: true,
      lastOpenedByUser: lastOpenedByUserMap,
    });

    try {
      // If a group is Private, members array  will only have 2 members
      let promiseArray: Promise<void>[] = [];
      const userRef = doc(db, "users/" + userID);
      const friendRef = doc(db, "users/" + friendID);

      promiseArray.push(
        updateDoc(userRef, {
          privateGroups: arrayUnion({
            friend: friendID,
            groupID: promise.id,
          }),
        })
      );

      promiseArray.push(
        updateDoc(friendRef, {
          privateGroups: arrayUnion({
            friend: userID,
            groupID: promise.id,
          }),
        })
      );

      Promise.all(promiseArray);
    } catch (error) {
      console.log(error);
    }

    return promise;
  };

  return { createPrivateGroup };
};
