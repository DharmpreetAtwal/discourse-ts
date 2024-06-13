import { useNavigate } from "react-router-dom";
import { useCreatePrivateGroup } from "./useCreatePrivateGroup";

export const useOpenPrivateGroup = () => {
  const { createPrivateGroup } = useCreatePrivateGroup();
  const navigate = useNavigate();

  const openPrivateGroup = async (
    userID: string,
    friendID: string,
    privateGroupID: string | null
  ) => {
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
