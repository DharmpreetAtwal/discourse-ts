import { useState, useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import useGetUserInfo from "../useGetUserInfo";
import { Message, UserInfo } from "../../interfaces/types";

export const useGetGroup = (userID: string, groupID: string | undefined) => {
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { getUserInfo } = useGetUserInfo();

  useEffect(() => {
    if (groupID) {
      const groupDoc = doc(db, "groups", groupID);
      const groupMessagesCollection = collection(
        db,
        "groups/" + groupID + "/" + "groupMessages"
      );

      const unsubscribe1 = onSnapshot(groupDoc, (snapshot) => {
        const data = snapshot.data();
        if (data && data.members.includes(userID)) {
          const unsubscribe2 = onSnapshot(
            groupMessagesCollection,
            (snapshot) => {
              let array: Message[] = [];
              snapshot.forEach((doc) => {
                if (doc.data().createdAt !== null) {
                  let msg: Message = {
                    id: doc.id,
                    createdAt: doc.data().createdAt,
                    message: doc.data().message,
                    sentBy: doc.data().sentBy,
                  };
                  array.push(msg);
                }
              });

              setMessages(array);
            }
          );

          let membersArray: Promise<UserInfo>[] = [];
          data.members.forEach(async (member: string) => {
            membersArray.push(getUserInfo(member));
          });

          Promise.all(membersArray).then((evaluated) => {
            setMembers(evaluated);
          });

          return () => {
            unsubscribe1();
            unsubscribe2();
          };
        } else {
          return () => {
            unsubscribe1();
          };
        }
      });
    }
  }, []);

  return { members, messages };
};
