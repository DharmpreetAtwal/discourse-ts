import { ref, set } from "firebase/database";
import { rtDB } from "../../config/firebase";

export const useSetIsOnline = () => {
  const setIsOnline = (userID: string, isOnline: boolean) => {
    const userIsOnlineRef = ref(rtDB, userID + "/isOnline");
    set(userIsOnlineRef, isOnline);
  };

  return { setIsOnline };
};
