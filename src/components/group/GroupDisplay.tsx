import React, { FC, useEffect, useRef, useState } from "react";
import { useGetGroup } from "../../hooks/group/useGetGroup";
import { UserInfo } from "../../interfaces/types";
import { useSendMessage } from "../../hooks/group/useSendMessage";
import useSetGroupLastOpenByUser from "../../hooks/group/useSetGroupLastOpenByUser";
import useGetOpenGroup from "../../hooks/group/useGetOpenGroup";
import { GroupDisplayProps } from "../../interfaces/group/groupTypes";
import { GroupMessageTag } from "./GroupMessageTag";
import { SidebarUI } from "./SidebarUI";

export const GroupDisplay: FC<GroupDisplayProps> = ({
  userID,
  groupID,
  isPrivate,
  isSidebarVisible,
}) => {
  const { members, messages } = useGetGroup(userID, groupID, true);
  const userMessageInputRef = useRef<HTMLInputElement>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (userID !== "") {
      console.log(fetched);
      setFetched(true);
    }
  }, [userID]);

  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();
  const { getOpenGroup } = useGetOpenGroup();

  const { sendMessage } = useSendMessage();

  const getMember = (userID: string): UserInfo => {
    let member: UserInfo = {
      uid: "",
      displayName: "NULL",
      photoURL: "NULL",
      email: "",
      friends: [],
      pendingFriends: [],
      privateGroups: [],
    };

    members.forEach((mem) => {
      if (mem.uid === userID) {
        member = mem;
      }
    });

    return member;
  };

  const isUserMember = () => {
    let isMember = false;

    members.forEach((member) => {
      if (member.uid === userID) {
        isMember = true;
      }
    });

    return isMember;
  };

  const updateOpenGroupMembers = () => {
    members.forEach(async (member) => {
      let group = await getOpenGroup(member.uid);

      // Only update lastOpened for person who is not sending message
      // Excludes case that is handled in sendMessage
      if (member.uid !== userID && group === groupID) {
        setGroupLastOpenByUser(member.uid, groupID);
      }
    });
  };

  const handleBtnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userMessageInputRef.current) {
      sendMessage(userID, groupID, userMessageInputRef.current.value);
      updateOpenGroupMembers();
      userMessageInputRef.current.value = "";
    }
  };

  return (
    <>
      {isUserMember() ? (
        <div className="flex flex-row flex-1 overflow-hidden relative">
          {/* Messages Area */}
          <div
            className={
              "flex flex-col pb-20 overflow-y-auto transition-all duration-300 " +
              (isSidebarVisible ? "w-2/3" : "w-full")
            }
          >
            {/* Messages Container */}
            <div className="flex-1 px-4 py-4 space-y-3">
              {messages.length > 0 ? (
                messages
                  .sort(
                    (a, b) =>
                      a.createdAt.toDate().valueOf() -
                      b.createdAt.toDate().valueOf()
                  )
                  .map((msg) => {
                    const sender = getMember(msg.sentBy);
                    return (
                      <GroupMessageTag key={msg.id} sender={sender} msg={msg} />
                    );
                  })
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-200">
                    <svg className="w-20 h-20 text-purple-400 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Be the first to start the conversation!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input - Fixed at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-purple-200 shadow-lg">
              <form onSubmit={(e) => handleBtnSubmit(e)} className="flex gap-3">
                <input
                  className="flex-1 px-5 py-3 bg-white border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 font-medium shadow-sm text-lg"
                  ref={userMessageInputRef}
                  placeholder="Type your message..."
                />
                <button
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                  type="submit"
                >
                  <span>Send</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          {isSidebarVisible && (
            <div className="w-1/3 border-l border-purple-200 bg-white/50 backdrop-blur-sm overflow-y-auto">
              <SidebarUI
                groupID={groupID}
                members={members}
                isPrivate={isPrivate}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border-2 border-red-300 text-center">
            <svg className="w-24 h-24 text-red-400 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-xl text-gray-600">You are not a member of this group</p>
          </div>
        </div>
      )}
    </>
  );
};
