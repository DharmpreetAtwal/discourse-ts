import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { LastOpenByUser, PrivateGroup } from "../interfaces/types";

export const useCreateGroup = () => {
  const groupCollectionRef = collection(db, "groups");

  const createGroup = async (
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

    try {
      if (isPrivate) {
        // If a group is Private, members array  will only have 2 members
        let promiseArray: Promise<void>[] = [];
        const userRef = doc(db, "users/" + userID);
        const friendRef = doc(db, "users/" + friends.at(0));

        promiseArray.push(
          updateDoc(userRef, {
            privateGroups: arrayUnion({
              friend: friends.at(0),
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
      }
      // if (isPrivate) {
      //   let promiseArray: Promise<void>[] = [];
      //   membersArray.forEach(async (member) => {
      //     const memberRef = doc(db, "users/" + member);
      //     promiseArray.push(
      //       updateDoc(memberRef, {
      //         privateGroups: arrayUnion(`${promise.id}`),
      //       })
      //     );
      //   });

      //   Promise.all(promiseArray);
      // }
    } catch (error) {
      console.log(error);
    }

    return promise;
  };

  return { createGroup };
};
