import { FC } from "react";
import { useAddFriend } from "../hooks/friend/useAddFriend";
import { PendingFriendsTagProps } from "../interfaces/types";

export const PendingFriendTag: FC<PendingFriendsTagProps> = ({
  friendInfo,
  userID,
}) => {
  const { addFriend } = useAddFriend();

  const handleAddFriendButton = async (friend: string) => {
    await addFriend(userID, friend);
  };

  return (
    <div className="flex flex-row w-full h-12 mb-1" key={friendInfo.uid}>
      <img className="h-full" src={friendInfo.photoURL} />

      <h1 className="flex bg-blue-500 text-3xl   w-full h-full items-center justify-center">
        {friendInfo.displayName}
      </h1>

      <button
        onClick={() => handleAddFriendButton(friendInfo.uid)}
        className="w-1/6 h-full bg-orange-500"
      >
        Add Friend
      </button>
    </div>
  );
};
