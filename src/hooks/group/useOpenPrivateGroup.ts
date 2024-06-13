import { useNavigate } from "react-router-dom";
import { PrivateGroup } from "../../interfaces/types";
import { useCreatePrivateGroup } from "./useCreatePrivateGroup";

export const useOpenPrivateGroup = () => {
  const { createPrivateGroup } = useCreatePrivateGroup();
  const navigate = useNavigate();

  const findPrivateGroup = (
    friendID: string,
    privateGroups: PrivateGroup[]
  ): string | null => {
    let privGroup: string | null = null;
    privateGroups.forEach((group: PrivateGroup) => {
      if (group.friend === friendID) {
        privGroup = group.groupID;
      }
    });
    return privGroup;
  };

  const openPrivateGroup = async (
    userID: string,
    friendID: string,
    privateGroups: PrivateGroup[]
  ) => {
    const privateGroupID = findPrivateGroup(friendID, privateGroups);

    if (privateGroupID === null) {
      await createPrivateGroup(userID, friendID).then((doc) => {
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
