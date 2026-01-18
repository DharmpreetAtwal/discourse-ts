import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetOpenGroup } from "../../hooks/group/useSetOpenGroup";
import { GroupProps } from "../../interfaces/group/groupTypes";
import { GroupDisplay } from "./GroupDisplay";
import { UserIDStateContext } from "../../App";
import { useEnableOnlinePresence } from "../../hooks/useEnableOnlinePresence";

export const Group: FC<GroupProps> = ({ isPrivate }) => {
  const { user } = useContext(UserIDStateContext);
  const { groupID } = useParams();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const navigate = useNavigate();
  const { setOpenGroup } = useSetOpenGroup();
  const { enableOnlinePresence } = useEnableOnlinePresence();

  useEffect(() => {
    if (user === undefined) {
      navigate("/", { replace: true });
    } else {
      enableOnlinePresence(user.uid);
      if (groupID) {
        setOpenGroup(user.uid, groupID);
      }
    }
  }, [user]);

  // Avoid using setGroupLastOpenByUser() on Home Btn click, causes issues
  const handleBtnHome = () => {
    setOpenGroup(user.uid, "");

    navigate("/home");
  };

  const handleBtnOpenSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <>
      {user && (
        <div className="flex flex-col w-screen h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            {/* Home Button */}
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-white/30"
              onClick={handleBtnHome}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Home</span>
            </button>

            {/* Group ID Display */}
            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <h1 className="text-xl md:text-2xl font-bold text-white truncate max-w-xs">
                {groupID ? `Group ${groupID.slice(0, 10)}...` : 'Group'}
              </h1>
            </div>

            {/* Sidebar Toggle Button */}
            <button
              onClick={handleBtnOpenSidebar}
              id="sidebarToggle"
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isSidebarVisible ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden md:inline">Close</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="hidden md:inline">Members</span>
                </>
              )}
            </button>
          </header>

          {/* Group Display Content */}
          {groupID !== undefined ? (
            <GroupDisplay
              userID={user.uid}
              groupID={groupID}
              isPrivate={isPrivate}
              isSidebarVisible={isSidebarVisible}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-red-100 border-2 border-red-400 rounded-2xl px-8 py-6 shadow-lg">
                <p className="text-red-700 text-xl font-bold">Invalid Group</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Group;
