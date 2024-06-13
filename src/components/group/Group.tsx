import React, { FC, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetOpenGroup } from "../../hooks/group/useSetOpenGroup";
import useSetGroupLastOpenByUser from "../../hooks/group/useSetGroupLastOpenByUser";
import useGetOpenGroup from "../../hooks/group/useGetOpenGroup";
import { GroupProps } from "../../interfaces/group/groupTypes";
import { useGetGroup } from "../../hooks/group/useGetGroup";
import { useSendMessage } from "../../hooks/group/useSendMessage";
import { UserInfo } from "../../interfaces/types";
import { GroupMessageTag } from "./GroupMessageTag";
import { SidebarUI } from "./SidebarUI";

export const Group: FC<GroupProps> = ({ userID, isPrivate }) => {
  const userMessageInputRef = useRef<HTMLInputElement>(null);
  const addMemberInputRef = useRef<HTMLInputElement>(null);
  const { groupID } = useParams();

  const { members, messages } = useGetGroup(userID, groupID);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const { sendMessage } = useSendMessage();
  const navigate = useNavigate();
  const { setOpenGroup } = useSetOpenGroup();
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();
  const { getOpenGroup } = useGetOpenGroup();

  const isUserMember = () => {
    let isMember = false;

    members.forEach((member) => {
      if (member.uid === userID) {
        isMember = true;
      }
    });

    return isMember;
  };

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

  // Avoid using setGroupLastOpenByUser() on Home Btn click, causes issues
  const handleBtnHome = () => {
    setOpenGroup(userID, "");
    navigate("/home");
  };

  const handleBtnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userMessageInputRef.current) {
      sendMessage(userID, groupID, userMessageInputRef.current.value);
      updateOpenGroupMembers();
      userMessageInputRef.current.value = "";
    }
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

  const handleBtnOpenSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex flex-row h-[10vh] bg-sky-500 justify-between">
          <div className="my-auto ml-1">
            <button
              className="bg-orange-500 p-2 rounded-lg text-2xl drop-shadow-md"
              onClick={handleBtnHome}
            >
              Home
            </button>
          </div>
          <div className="my-auto rounded-2xl text-4xl bg-pink-500 px-4 py-2">
            {groupID}
          </div>
          <div className="my-auto">
            <button
              onClick={handleBtnOpenSidebar}
              id="sidebarToggle"
              type="button"
              className="bg-purple-500 text-2xl mx-2 p-2 rounded-lg shadow-sm"
            >
              Open Sidebar
            </button>
          </div>
        </div>
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
                addMemberInputRef={addMemberInputRef}
              />
            )}

            <div className="fixed bottom-0 p-2 w-full">
              <form onSubmit={(e) => handleBtnSubmit(e)}>
                <input
                  className="bg-red-500 w-11/12 p-1 text-4xl"
                  ref={userMessageInputRef}
                  placeholder="Message"
                />
                <button className="bg-orange-500 text-3xl w-1/12" type="submit">
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
      </div>
    </>
  );
};

export default Group;
