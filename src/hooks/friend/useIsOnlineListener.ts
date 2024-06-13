import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { rtDB } from "../../config/firebase";

export const useIsOnlineListener = (friendID: string) => {
  const [isOnlineListener, setIsOnlineListener] = useState(false);

  useEffect(() => {
    const isOnlineRef = ref(rtDB, friendID + "/isOnline");

    onValue(isOnlineRef, (snapshot) => {
      setIsOnlineListener(snapshot.val());
    });
  }, []);

  return { isOnlineListener };
};
