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
        <div className="flex flex-row bg-slate-600 relative h-[90vh] w-full">
          <div
            className={
              "bg-slate-500 pb-16 overflow-auto no-scrollbar " +
              (isSidebarVisible ? "w-4/5" : "w-full")
            }
          >
            {messages.length > 0 &&
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
                })}
          </div>

          {isSidebarVisible && (
            <SidebarUI
              groupID={groupID}
              members={members}
              isPrivate={isPrivate}
            />
          )}

          <div className="fixed bottom-0 p-2 w-full">
            <form onSubmit={(e) => handleBtnSubmit(e)}>
              <input
                className="bg-red-500 w-11/12 p-1 text-4xl"
                ref={userMessageInputRef}
                placeholder="Message"
              />
              <button
                className="bg-orange-500 hover:bg-orange-400 text-3xl w-1/12"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1> You are not a member of this group </h1>
        </div>
      )}
    </>
  );
};
