import { FC } from "react";
import { useAddFriend } from "../../hooks/friend/useAddFriend";
import { PendingFriendsTagProps } from "../../interfaces/friend/friendTypes";

export const PendingFriendTag: FC<PendingFriendsTagProps> = ({
  friendInfo,
  userID,
}) => {
  const { addFriend } = useAddFriend();

  const handleAddFriendButton = async (friend: string) => {
    await addFriend(userID, friend);
  };

  return (
    <div
      className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 backdrop-blur-sm rounded-xl transition-all duration-200 hover:shadow-lg border-2 border-yellow-400/40"
      key={friendInfo.uid}
    >
      {/* Profile Picture */}
      <div className="relative flex-shrink-0">
        <img
          className="h-12 w-12 rounded-full object-cover ring-2 ring-yellow-400 shadow-md"
          src={friendInfo.photoURL}
          alt={friendInfo.displayName}
        />
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Friend Name */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-sm truncate">
          {friendInfo.displayName}
        </h3>
        <p className="text-yellow-200 text-xs font-medium">
          Friend request pending
        </p>
      </div>

      {/* Accept Button */}
      <button
        onClick={() => handleAddFriendButton(friendInfo.uid)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Accept
      </button>
    </div>
  );
};
