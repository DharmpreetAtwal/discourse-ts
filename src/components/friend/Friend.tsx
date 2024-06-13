import { useSendFriendRequest } from "../../hooks/friend/useSendFriendRequest";
import { useGetUserFriends } from "../../hooks/friend/useGetUserFriends";
import { FC, useRef } from "react";
import { FriendProps } from "../../interfaces/friend/friendTypes";
import { PrivateGroup } from "../../interfaces/types";
import { FriendTag } from "../friend/FriendTag";
import { PendingFriendTag } from "../friend/PendingFriendTag";

export const Friend: FC<FriendProps> = ({ userID }) => {
  const { friends, pendingFriends, privateGroups } = useGetUserFriends(userID);
  const { sendFriendRequest } = useSendFriendRequest();

  const sendFriendRequestInputRef = useRef<HTMLInputElement>(null);

  const findPrivateGroup = (friendID: string): string | null => {
    let privGroup: string | null = null;
    privateGroups.forEach((group: PrivateGroup) => {
      if (group.friend === friendID) {
        privGroup = group.groupID;
      }
    });
    return privGroup;
  };

  return (
    <div>
      <div className="mb-2">
        {friends.map((friend) => {
          return (
            <FriendTag
              key={friend.uid}
              userID={userID}
              friendInfo={friend}
              privateGroup={findPrivateGroup(friend.uid)}
            />
          );
        })}
      </div>
      <div className="mb-2">
        <h2 className="bg-purple-400 text-2xl text-pink-500 text-center">
          Add a Friend
        </h2>
        <input ref={sendFriendRequestInputRef} className="bg-pink-500 w-5/6" />
        <button
          className="bg-green-500 w-1/6"
          onClick={() =>
            sendFriendRequest(sendFriendRequestInputRef.current!.value, userID)
          }
        >
          Add
        </button>
      </div>
      <div className="mb-2">
        <h1 className="bg-purple-500">Pending Friends</h1>
        {pendingFriends.map((friend) => {
          return <PendingFriendTag userID={userID} friendInfo={friend} />;
        })}
      </div>
    </div>
  );
};

export default Friend;
