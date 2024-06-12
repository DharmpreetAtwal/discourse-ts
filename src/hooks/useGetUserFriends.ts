import {
  DocumentData,
  DocumentSnapshot,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import useGetUserInfo from "./useGetUserInfo";
import { PrivateGroup, UserInfo } from "../interfaces/types";

export const useGetUserFriends = (userID: string) => {
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [pendingFriends, setPendingFriends] = useState<UserInfo[]>([]);
  const [privateGroups, setPrivateGroups] = useState<PrivateGroup[]>([]);
  const { getUserInfo } = useGetUserInfo();

  useEffect(() => {
    const userDoc = doc(db, "users", userID);
    const unsubscribe1 = onSnapshot(userDoc, async (snapshot) => {
      if (snapshot.exists()) {
        let friendsArray: Promise<UserInfo>[] = [];
        snapshot.data().friends.forEach((friend: string) => {
          friendsArray.push(getUserInfo(friend));
        });

        // console.log(friendsArray);
        Promise.all(friendsArray).then((evaluated: UserInfo[]) => {
          // console.log(evaluated);
          setFriends(evaluated);
        });

        let pendingFriendsArray: Promise<UserInfo>[] = [];
        snapshot.data().pendingFriends.forEach((friend: string) => {
          pendingFriendsArray.push(getUserInfo(friend));
        });

        Promise.all(pendingFriendsArray).then((evaluated: UserInfo[]) => {
          setPendingFriends(evaluated);
        });

        try {
          let groupArray: Promise<
            DocumentSnapshot<DocumentData, DocumentData>
          >[] = [];

          console.log(snapshot.data().privateGroups);
          snapshot
            .data()
            .privateGroups.forEach(
              (group: { groupID: string; friend: string }) => {
                const groupRef = doc(db, "groups/" + group.groupID);
                groupArray.push(getDoc(groupRef));
              }
            );

          let privateGroupArray: PrivateGroup[] = [];
          Promise.all(groupArray).then((evaluated) => {
            evaluated.forEach((group) => {
              const data = group.data();
              if (data) {
                let friendID = data.members
                  .filter((item: string) => item !== userID)
                  .at(0);
                const privGroup: PrivateGroup = {
                  friend: friendID,
                  groupID: group.id,
                };
                privateGroupArray.push(privGroup);
              }
            });

            setPrivateGroups(privateGroupArray);
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  return { friends, pendingFriends, privateGroups };
};
