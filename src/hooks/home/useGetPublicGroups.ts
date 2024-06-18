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
import { Group } from "../../interfaces/group/groupTypes";
import { GroupData } from "../../interfaces/home/homeTypes";

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
      const messageData = latestMessage.data();
      if (messageData !== undefined) {
        let latestMessageMap = {
          id: latestMessage.id,
          createdAt: messageData.createdAt,
          message: messageData.message,
          sentBy: messageData.sentBy,
        };

        groupList[index].data.latestMessage = latestMessageMap;
      } else {
        groupList[index].data.latestMessage = null;
      }
    });

    return groupList;
  };

  return { getPublicGroups };
};
