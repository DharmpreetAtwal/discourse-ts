import { FC, useContext, useEffect, useState } from "react";
import {
  Group,
  PublicGroupHomeTageProps,
} from "../../interfaces/group/groupTypes";
import { LastOpenByUser } from "../../interfaces/home/homeTypes";
import { UserIDStateContext } from "../../App";
import { useSetOpenGroup } from "../../hooks/group/useSetOpenGroup";
import useSetGroupLastOpenByUser from "../../hooks/group/useSetGroupLastOpenByUser";
import { useNavigate } from "react-router-dom";
import { useGetGroup } from "../../hooks/group/useGetGroup";

export const PublicGroupHomeTag: FC<PublicGroupHomeTageProps> = ({ group }) => {
  const { user } = useContext(UserIDStateContext);
  const { latestMessage } = useGetGroup(user.uid, group.id);
  const [lastOpenedByUser, setLastOpenByUser] = useState<LastOpenByUser | null>(
    null
  );

  const { setOpenGroup } = useSetOpenGroup();
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();
  const navigate = useNavigate();

  useEffect(() => {
    setLastOpenByUser(findLastOpenedByUser(group, user.uid));
  }, []);

  const findLastOpenedByUser = (
    group: Group,
    userID: string
  ): null | LastOpenByUser => {
    const lastOpened = group.data.lastOpenedByUser;

    let userOpen = null;

    if (lastOpened) {
      lastOpened.forEach((open) => {
        if (open.userID === userID) {
          userOpen = open;
        }
      });
    }
    return userOpen;
  };

  const isLatestMessageRead = (group: Group) => {
    const lastOpenMap = findLastOpenedByUser(group, user.uid);

    if (lastOpenMap) {
      if (latestMessage) {
        if (latestMessage.createdAt) {
          const latestMessageDate = latestMessage.createdAt.toDate();
          return (
            latestMessageDate.getTime() <
            lastOpenMap.lastOpened.toDate().getTime()
          );
        }
      } else {
        console.log("No Latest Msg");
      }

      // if (lastOpenMap) {
      //   if (group.data.latestMessage) {
      //     if (group.data.latestMessage.createdAt) {
      //       const latestMessageDate = group.data.latestMessage.createdAt.toDate();
      //       return (
      //         latestMessageDate.getTime() <
      //         lastOpenMap.lastOpened.toDate().getTime()
      //       );
      //     }
      //   } else {
      //     console.log("No Latest Msg");
      //   }

      // If the user has opened the group after the latest msg was sent, return true
    } else {
      console.log("User has never opened before");
    }
    return false;
  };

  const navigateGroup = (groupID: string) => {
    if (groupID !== null) {
      setOpenGroup(user.uid, groupID);
      setGroupLastOpenByUser(user.uid, groupID);
      navigate("/group/" + groupID);
    }
  };

  return (
    <div className="flex flex-row w-11/12 m-1" key={group.id}>
      <div className="flex flex-row bg-purple-500 justify-between items-center w-full px-3 h-16 rounded-l-3xl text-2xl shadow-md">
        {group.id}
        {isLatestMessageRead(group) ? (
          <div className="flex text-neutral-700 bg-amber-500 h-1/2 items-center justify-center px-2 rounded-lg">
            <p>
              {lastOpenedByUser &&
                lastOpenedByUser.lastOpened.toDate().toDateString().toString() +
                  " " +
                  lastOpenedByUser.lastOpened
                    .toDate()
                    .toLocaleTimeString()
                    .toString()}
            </p>
          </div>
        ) : (
          <div
            className={
              "flex " +
              (latestMessage
                ? "bg-emerald-700 text-lime-400"
                : "bg-amber-500 text-red-600") +
              "  h-1/2 justify-center items-center px-2 rounded-lg text-xl"
            }
          >
            {latestMessage
              ? "New: " + latestMessage.sentBy
              : "No Latest Message"}
          </div>
        )}
      </div>
      <button
        className="bg-green-500 hover:bg-green-400 w-1/6 h-full rounded-r-3xl text-2xl shadow-lg"
        onClick={() => navigateGroup(group.id)}
      >
        Join
      </button>
    </div>
  );
};
