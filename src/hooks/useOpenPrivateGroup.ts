import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { PrivateGroupTuple } from "../interfaces/types";

export const useOpenPrivateGroup = () => {
  const groupCollection = collection(db, "groups");
  const navigate = useNavigate();

  const findPrivateGroup = (
    friendID: string,
    privateGroups: PrivateGroupTuple[]
  ): string | null => {
    privateGroups.forEach((group: PrivateGroupTuple) => {
      if (group[0] === friendID) {
        return group[1];
      }
    });
    return null;
  };

  const openPrivateGroup = async (
    userID: string,
    friendID: string,
    privateGroups: PrivateGroupTuple[]
  ) => {
    const privateGroupID = findPrivateGroup(friendID, privateGroups);

    if (privateGroupID === null) {
      await addDoc(groupCollection, {
        creatorID: userID,
        members: [userID, friendID],
        isPrivate: true,
      }).then((doc) => {
        navigate("../privateGroup/" + doc.id + "/" + friendID, {
          replace: true,
        });
      });
    } else {
      navigate("../privateGroup/" + privateGroupID + "/" + friendID, {
        replace: true,
      });
    }
  };

  return { openPrivateGroup };
};
