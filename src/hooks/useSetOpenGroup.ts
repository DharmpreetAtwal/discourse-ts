import { ref, set } from "firebase/database";
import { rtDB } from "../config/firebase";

export const useSetOpenGroup = () => {
  const setOpenGroup = (userID: string, groupID: string) => {
    const userOpenGroupRef = ref(rtDB, userID + "/openGroup");
    set(userOpenGroupRef, groupID);
  };

  return { setOpenGroup };
};
