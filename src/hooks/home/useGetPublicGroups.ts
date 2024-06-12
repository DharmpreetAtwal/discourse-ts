import {
  DocumentData,
  DocumentSnapshot,
  query,
  collection,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Group, GroupData } from "../../interfaces/types";

export const useGetPublicGroups = () => {
  const getPublicGroups = async (userID: string) => {
    const queryPublicGroup = query(
      collection(db, "groups"),
      where("isPrivate", "==", false),
      where("members", "array-contains", userID)
    );

    let groupList: Group[] = [];
    var promiseList: Promise<DocumentSnapshot<DocumentData, DocumentData>>[] =
      [];
    const qSnapshot = await getDocs(queryPublicGroup);

    qSnapshot.forEach((group) => {
      if (group.id) {
        // let groupMap: Group = { id: group.id, data: group.data() };
        const groupData = group.data() as GroupData;

        let groupMap: Group = { id: group.id, data: groupData };
        groupList.push(groupMap);
      }

      if (group.data().latestMessage) {
        const latestMessageDoc = doc(
          db,
          "groups/" +
            group.id +
            "/groupMessages/" +
            group.data().latestMessage.id
        );

        promiseList.push(getDoc(latestMessageDoc));
      }
    });

    const promises = await Promise.all(promiseList);
    promises.forEach((latestMessage, index) => {
      groupList[index].data.latestMessage = latestMessage;
    });

    return groupList;
  };

  return { getPublicGroups };
};
