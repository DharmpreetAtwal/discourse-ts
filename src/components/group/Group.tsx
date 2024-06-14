import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetOpenGroup } from "../../hooks/group/useSetOpenGroup";
import { GroupProps } from "../../interfaces/group/groupTypes";
import { GroupDisplay } from "./GroupDisplay";
import { UserIDStateContext } from "../../App";

export const Group: FC<GroupProps> = ({ isPrivate }) => {
  const { userID } = useContext(UserIDStateContext);
  const { groupID } = useParams();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const navigate = useNavigate();
  const { setOpenGroup } = useSetOpenGroup();

  useEffect(() => {
    if (userID === undefined) {
      navigate("/", { replace: true });
    }
  }, [userID]);

  // Avoid using setGroupLastOpenByUser() on Home Btn click, causes issues
  const handleBtnHome = () => {
    setOpenGroup(userID, "");
    navigate("/home");
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
        {groupID !== undefined ? (
          <GroupDisplay
            userID={userID}
            groupID={groupID}
            isPrivate={isPrivate}
            isSidebarVisible={isSidebarVisible}
          />
        ) : (
          <p> Invalid Group</p>
        )}
      </div>
    </>
  );
};

export default Group;
