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
import { PrivateGroupTuple, UserInfo } from "../interfaces/types";

export const useGetUserFriends = (userID: string) => {
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [pendingFriends, setPendingFriends] = useState<UserInfo[]>([]);
  const [privateGroups, setPrivateGroups] = useState<PrivateGroupTuple[]>([]);
  const { getUserInfo } = useGetUserInfo();

  useEffect(() => {
    const userDoc = doc(db, "users", userID);
    const unsubscribe1 = onSnapshot(userDoc, async (snapshot) => {
      if (snapshot.exists()) {
        let friendsArray: Promise<UserInfo>[] = [];
        snapshot.data().friends.forEach((friend: string) => {
          friendsArray.push(getUserInfo(friend));
        });

        Promise.all(friendsArray).then((evaluated: UserInfo[]) => {
          setFriends(evaluated);
        });

        let pendingFriendsArray: Promise<UserInfo>[] = [];
        snapshot.data().pendingFriends.forEach((friend: string) => {
          pendingFriendsArray.push(getUserInfo(friend));
        });

        Promise.all(pendingFriendsArray).then((evaluated: UserInfo[]) => {
          setPendingFriends(evaluated);
        });

        let groupArray: Promise<
          DocumentSnapshot<DocumentData, DocumentData>
        >[] = [];
        snapshot.data().privateGroups.forEach((group: string) => {
          const groupRef = doc(db, "groups", group);
          groupArray.push(getDoc(groupRef));
        });

        let privateGroupArray: PrivateGroupTuple[] = [];
        Promise.all(groupArray).then((evaluated) => {
          evaluated.forEach((group) => {
            const data = group.data();
            if (data) {
              let friendID = data.members
                .filter((item: string) => item !== userID)
                .at(0);
              const tuple: PrivateGroupTuple = [friendID, group.id];
              privateGroupArray.push(tuple);
            }
          });

          setPrivateGroups(privateGroupArray);
        });
      }
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  return { friends, pendingFriends, privateGroups };
};
