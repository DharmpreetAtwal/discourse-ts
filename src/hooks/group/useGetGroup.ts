import { useState, useEffect } from "react";
import { doc, collection, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import useGetUserInfo from "../friend/useGetUserInfo";
import { UserInfo } from "../../interfaces/types";
import { Message } from "../../interfaces/group/groupTypes";
import { GroupData } from "../../interfaces/home/homeTypes";

export const useGetGroup = (
  userID: string,
  groupID: string | undefined,
  isListeningGroupMessages: boolean = false
) => {
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const { getUserInfo } = useGetUserInfo();

  useEffect(() => {
    if (groupID) {
      const groupDoc = doc(db, "groups", groupID);

      const unsubscribe1 = onSnapshot(groupDoc, async (snapshot) => {
        const data: GroupData = snapshot.data() as unknown as GroupData;

        if (data && data.members.includes(userID)) {
          if (data.latestMessage) {
            const latestMessageDocRef = doc(
              db,
              "groups/" + groupID + "/groupMessages/" + data.latestMessage.id
            );

            const latestMessageDocSnapshot = await getDoc(latestMessageDocRef);
            if (latestMessageDocSnapshot.exists()) {
              let messageMap: Message = {
                id: data.latestMessage.id,
                createdAt: latestMessageDocSnapshot.data().createdAt,
                message: latestMessageDocSnapshot.data().message,
                sentBy: latestMessageDocSnapshot.data().sentBy,
              };
              setLatestMessage(messageMap);
            }
          }
        }
        let membersArray: Promise<UserInfo>[] = [];
        data.members.forEach(async (member: string) => {
          membersArray.push(getUserInfo(member));
        });

        Promise.all(membersArray).then((evaluated) => {
          setMembers(evaluated);
        });
      });

      return () => {
        unsubscribe1();
      };
    }
  }, []);

  useEffect(() => {
    let isMember = false;
    members.forEach((member) => {
      if (member.uid === userID) {
        isMember = true;
      }
    });

    if (isListeningGroupMessages && isMember) {
      const groupMessagesCollection = collection(
        db,
        "groups/" + groupID + "/" + "groupMessages"
      );

      const unsubscribe2 = onSnapshot(groupMessagesCollection, (snapshot) => {
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
      });

      return () => {
        unsubscribe2();
      };
    }
  }, [members]);

  return { members, messages, latestMessage };
};
