import { FC } from "react";
import { FriendTagProps } from "../../interfaces/types";
import { useOpenPrivateGroup } from "../../hooks/group/useOpenPrivateGroup";
import { useIsOnlineListener } from "../../hooks/friend/useIsOnlineListener";
export const FriendTag: FC<FriendTagProps> = ({
  userID,
  friendInfo,
  privateGroup,
}) => {
  const { isOnlineListener } = useIsOnlineListener(friendInfo.uid);
  const { openPrivateGroup } = useOpenPrivateGroup();

  const handleOpenPrivateGroupBtn = (friendID: string) => {
    openPrivateGroup(userID, friendID, privateGroup);
  };

  return (
    <div
      className="w-full flex flex-row h-16 mb-1 p-2 bg-slate-100 justify-between items-center"
      key={friendInfo.uid}
    >
      <div className="flex flex-row h-full">
        <img className="h-full rounded-full mr-2" src={friendInfo.photoURL} />{" "}
        <div className="flex flex-col">
          {friendInfo.displayName}
          <h1
            className={
              isOnlineListener
                ? "text-emerald-500 font-bold"
                : "text-red-500 italic"
            }
          >
            {isOnlineListener ? "Online" : "Offline"}
          </h1>
        </div>
      </div>

      <button
        onClick={() => handleOpenPrivateGroupBtn(friendInfo.uid)}
        className={
          "w-1/5 h-3/4 text-xl rounded-lg m-1 shadow-md " +
          (isOnlineListener
            ? privateGroup === null
              ? "bg-blue-500"
              : "bg-green-500"
            : "bg-slate-500")
        }
      >
        Chat
      </button>
    </div>
  );
};
