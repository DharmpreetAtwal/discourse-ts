import { FC } from "react";
import { FriendTagProps } from "../../interfaces/friend/friendTypes";
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
      className="w-full flex flex-row items-center gap-3 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 hover:shadow-lg border border-white/20"
      key={friendInfo.uid}
    >
      {/* Profile Picture with Status Indicator */}
      <div className="relative flex-shrink-0">
        <img
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30 shadow-md"
          src={friendInfo.photoURL}
          alt={friendInfo.displayName}
        />
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${
            isOnlineListener ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
          }`}
        />
      </div>

      {/* Friend Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm truncate">
          {friendInfo.displayName}
        </h3>
        <p
          className={`text-xs font-medium ${
            isOnlineListener
              ? "text-emerald-300"
              : "text-gray-300 italic"
          }`}
        >
          {isOnlineListener ? "Online" : "Offline"}
        </p>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => handleOpenPrivateGroupBtn(friendInfo.uid)}
        className={`px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-1.5 ${
          isOnlineListener
            ? privateGroup === null
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            : "bg-gray-500 hover:bg-gray-600 text-gray-200"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </button>
    </div>
  );
};
