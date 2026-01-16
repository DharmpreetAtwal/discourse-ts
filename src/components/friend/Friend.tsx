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
    <div className="flex flex-col h-full">
      {/* Friends List Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {friends.length > 0 ? (
          friends.map((friend) => {
            return (
              <FriendTag
                key={friend.uid}
                userID={userID}
                friendInfo={friend}
                privateGroup={findPrivateGroup(friend.uid)}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="w-16 h-16 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-blue-200 font-medium">No friends yet</p>
            <p className="text-blue-300 text-sm mt-1">Add someone below!</p>
          </div>
        )}
      </div>


      {/* Add Friend Section */}
      <div className="border-t border-blue-400/50 bg-blue-600/20 backdrop-blur-sm">
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add a Friend
          </h2>
          <div className="flex gap-2">
            <input
              ref={sendFriendRequestInputRef}
              placeholder="Enter email..."
              className="flex-1 px-4 py-2.5 bg-white/90 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-800 placeholder-gray-400 font-medium shadow-sm"
            />
            <button
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-1"
              onClick={() =>
                sendFriendRequest(sendFriendRequestInputRef.current!.value, userID)
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Pending Friends Section */}
      {pendingFriends.length > 0 && (
        <div className="border-t border-blue-400/50 bg-blue-600/30 backdrop-blur-sm">
          <div className="px-4 py-3">
            <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Pending Requests
              <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                {pendingFriends.length}
              </span>
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pendingFriends.map((friend) => {
                return <PendingFriendTag key={friend.uid} userID={userID} friendInfo={friend} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friend;
