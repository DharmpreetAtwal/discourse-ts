import { FC, useRef } from "react";
import { Sidebar } from "../../interfaces/group/groupTypes";
import { useAddMember } from "../../hooks/group/useAddMember";

export const SidebarUI: FC<Sidebar> = ({ members, isPrivate, groupID }) => {
  const { addMember } = useAddMember();
  const addMemberInputRef = useRef<HTMLInputElement>(null);

  const handleBtnAddMember = () => {
    if (addMemberInputRef.current) {
      addMember(addMemberInputRef.current.value, groupID);
      addMemberInputRef.current.value = "";
    }
  };

  return (
    <div
      id="sidebar"
      className="bg-yellow-200 w-1/5 transition-all duration-500"
    >
      <div>
        <p> Current Members: </p>
        {members.map((member) => {
          return (
            <div
              className="flex flex-row w-full h-12 mb-2 justify-center items-center"
              key={member.uid}
            >
              <div className="w-1/6 h-full rounded-full">
                <img className="rounded-full" src={`${member.photoURL}`} />
              </div>

              <div className="flex w-5/6 items-center justify-center bg-green-500 p-2 text-2xl">
                {member.displayName}
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-auto">
        {!isPrivate && (
          <div>
            <input
              className="bg-green-500 text-gray-900"
              ref={addMemberInputRef}
              placeholder="Add a Member"
            />
            <button
              className="bg-purple-500 hover:bg-purple-400"
              onClick={handleBtnAddMember}
            >
              Add Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
