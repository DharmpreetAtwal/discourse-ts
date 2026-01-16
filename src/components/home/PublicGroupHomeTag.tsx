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
import { UserInfo } from "../../interfaces/types";
import useGetUserInfo from "../../hooks/friend/useGetUserInfo";

export const PublicGroupHomeTag: FC<PublicGroupHomeTageProps> = ({ group }) => {
  const { user } = useContext(UserIDStateContext);
  const { latestMessage } = useGetGroup(user.uid, group.id);
  const [latestMessageSenderInfo, setLatestMessageSenderInfo] =
    useState<UserInfo>();
  const [lastOpenedByUser, setLastOpenByUser] = useState<LastOpenByUser | null>(
    null
  );

  const { setOpenGroup } = useSetOpenGroup();
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();
  const { getUserInfo } = useGetUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    setLastOpenByUser(findLastOpenedByUser(group, user.uid));
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (latestMessage !== null) {
        const userInfo = await getUserInfo(latestMessage.sentBy);
        setLatestMessageSenderInfo(userInfo);
      }
    };

    fetchUserInfo();
  }, [latestMessage]);

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
    <div
      className="flex items-center gap-3 w-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] overflow-hidden border border-purple-200/50"
      key={group.id}
    >
      {/* Group Info Section */}
      <div className="flex-1 flex items-center justify-between px-5 py-4">
        {/* Group ID/Name */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 truncate max-w-xs">
              Group {group.id.slice(0, 8)}...
            </h3>
            <p className="text-sm text-gray-500">Public conversation</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center">
          {isLatestMessageRead(group) ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-300">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div className="flex flex-col text-xs">
                <span className="text-gray-600 font-semibold">All caught up</span>
                {lastOpenedByUser && (
                  <span className="text-gray-500">
                    {lastOpenedByUser.lastOpened.toDate().toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              className={
                "flex items-center gap-2 px-4 py-2 rounded-lg " +
                (latestMessage
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md")
              }
            >
              {latestMessageSenderInfo ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                        src={latestMessageSenderInfo.photoURL}
                        alt={latestMessageSenderInfo.displayName}
                      />
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">New message</span>
                      <span className="text-xs font-medium opacity-90">
                        from {latestMessageSenderInfo.displayName}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-bold">No messages yet</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Join Button */}
      <button
        className="h-full px-8 py-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-r-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
        onClick={() => navigateGroup(group.id)}
      >
        <span>Join</span>
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
};
