import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { LastOpenByUser } from "../interfaces/types";

export const useCreatePublicGroup = () => {
  const groupCollectionRef = collection(db, "groups");

  const createPublicGroup = async (
    userID: string,
    friends: string[],
    isPrivate: boolean
  ) => {
    let membersArray = [...friends, userID];
    const lastOpenedByUserMap: LastOpenByUser[] = [
      { userID: userID, lastOpened: Timestamp.now() },
    ];
    const promise = await addDoc(groupCollectionRef, {
      creatorID: userID,
      members: membersArray,
      isPrivate: isPrivate,
      lastOpenedByUser: lastOpenedByUserMap,
    });
    return promise;
  };

  return { createPublicGroup };
};
