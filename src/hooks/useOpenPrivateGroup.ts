import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { PrivateGroup } from "../interfaces/types";

export const useOpenPrivateGroup = () => {
  const groupCollection = collection(db, "groups");
  const navigate = useNavigate();

  const findPrivateGroup = (
    friendID: string,
    privateGroups: PrivateGroup[]
  ): string | null => {
    privateGroups.forEach((group: PrivateGroup) => {
      if (group.friend === friendID) {
        return group.groupID;
      }
    });
    return null;
  };

  const openPrivateGroup = async (
    userID: string,
    friendID: string,
    privateGroups: PrivateGroup[]
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
