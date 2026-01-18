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
      className="flex flex-col h-full"
    >
      {/* Members Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Members
            <span className="ml-auto bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {members.length}
            </span>
          </h3>
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {members.map((member) => {
            return (
              <div
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-purple-200/50"
                key={member.uid}
              >
                <img
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-300 shadow-sm"
                  src={`${member.photoURL}`}
                  alt={member.displayName}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {member.displayName}
                  </p>
                  <p className="text-xs text-gray-500">Member</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Section - Only for Public Groups */}
      {!isPrivate && (
        <div className="border-t border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
          <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Member
          </h4>
          <div className="flex flex-col gap-2">
            <input
              className="w-full px-3 py-2 bg-white border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-sm font-medium shadow-sm"
              ref={addMemberInputRef}
              placeholder="Enter email..."
            />
            <button
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={handleBtnAddMember}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
