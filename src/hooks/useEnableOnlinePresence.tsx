import { useSetIsOnline } from "./friend/useSetIsOnline";
import { onDisconnect, ref } from "firebase/database";
import { rtDB } from "../config/firebase";
import useIsOnline from "./friend/useIsOnline";

export const useEnableOnlinePresence = () => {
  const { setIsOnline } = useSetIsOnline();
  const { isOnline } = useIsOnline();

  const enableOnlinePresence = async (userID: string) => {
    const check = await isOnline(userID);

    if (!check) {
      setIsOnline(userID, true);

      // Reset isOnline and openGroup upon disconnect
      const userIsOnlineRef = ref(rtDB, userID + "/isOnline");
      const userOpenGroupRef = ref(rtDB, userID + "/openGroup");
      onDisconnect(userIsOnlineRef).set(false);
      onDisconnect(userOpenGroupRef).set("");
    } else {
      console.log("Already attached");
    }
  };

  return { enableOnlinePresence };
};
