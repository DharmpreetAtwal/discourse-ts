import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import useSetGroupLastOpenByUser from "./useSetGroupLastOpenByUser";

export const useSendMessage = () => {
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();

  const sendMessage = async (
    userID: string,
    groupID: string | undefined,
    message: string
  ) => {
    if (groupID !== undefined) {
      const groupMessagesCollection = collection(
        db,
        "groups/" + groupID + "/" + "groupMessages"
      );
      const groupDoc = doc(db, "groups/" + groupID);

      if (message !== "") {
        const docRef = await addDoc(groupMessagesCollection, {
          createdAt: Timestamp.now(),
          sentBy: userID,
          message: message,
        });

        await updateDoc(groupDoc, {
          latestMessage: docRef,
        });

        setGroupLastOpenByUser(userID, groupID);
      }
    }
  };

  return { sendMessage };
};
