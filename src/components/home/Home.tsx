import { useState, useEffect, FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import Friend from "../friend/Friend";
import { useSetIsOnline } from "../../hooks/friend/useSetIsOnline";
import { useGetPublicGroups } from "../../hooks/home/useGetPublicGroups";
import { useCreatePublicGroup } from "../../hooks/group/useCreatePublicGroup";
import { useSetOpenGroup } from "../../hooks/group/useSetOpenGroup";
import useSetGroupLastOpenByUser from "../../hooks/group/useSetGroupLastOpenByUser";
import { Group } from "../../interfaces/group/groupTypes";
import { LastOpenByUser } from "../../interfaces/home/homeTypes";
import { UserIDStateContext } from "../../App";
import { useEnableOnlinePresence } from "../../hooks/useEnableOnlinePresence";

const cookies = new Cookies();

export const Home: FC = () => {
  const { user } = useContext(UserIDStateContext);

  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [fetchedPublicGroups, setFetchedPublicGroups] = useState(false);

  const navigate = useNavigate();
  const { setIsOnline } = useSetIsOnline();
  const { getPublicGroups } = useGetPublicGroups();
  const { createPublicGroup } = useCreatePublicGroup();
  const { setOpenGroup } = useSetOpenGroup();
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();
  const { enableOnlinePresence } = useEnableOnlinePresence();

  const navigateGroup = (groupID: string) => {
    if (groupID !== null) {
      setOpenGroup(user.uid, groupID);
      setGroupLastOpenByUser(user.uid, groupID);
      navigate("/group/" + groupID);
    }
  };

  useEffect(() => {
    if (user === undefined) {
      navigate("/", { replace: true });
    } else {
      const handleFetch = async () => {
        const output = await getPublicGroups(user.uid);
        setPublicGroups(output);
        setFetchedPublicGroups(true);
      };

      enableOnlinePresence(user.uid);
      handleFetch();
    }
  }, [user]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        cookies.remove("user", { path: "/" });
        navigate("/");
        setIsOnline(user.uid, false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCreateGroupBtn = () => {
    createPublicGroup(user.uid, [], false).then((doc) => {
      navigateGroup(doc.id);
    });
  };

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
      if (group.data.latestMessage) {
        const data = group.data.latestMessage.data();
        if (data) {
          const latestMessageTime = data.createdAt.toDate();
          return (
            latestMessageTime.getTime() <
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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row bg-orange-500 h-[10vh] min-w-full p-4 justify-between">
          <div>
            <img
              className="max-h-full shadow-xl rounded-full"
              src={`${user.photoURL}`}
            />
          </div>
          <div className="flex bg-blue-300 w-1/5 rounded-2xl shadow-xl text-3xl items-center justify-center">
            <p>{user.displayName}</p>
          </div>
          <div className="flex">
            <button
              onClick={handleSignOut}
              className="rounded-3xl px-4 drop-shadow-md text-3xl bg-red-500 hover:bg-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-row bg-slate-200 h-[90vh] min-w-screen">
          <div className="flex flex-col w-1/3 bg-slate-600">
            {fetchedPublicGroups && <Friend userID={user.uid} />}
          </div>
          <div className="flex flex-col w-2/3 h-full overflow-auto items-center">
            {publicGroups.map((group) => {
              const latestMessage = group.data.latestMessage;
              const lastOpenedByUser = findLastOpenedByUser(group, user.uid);
              return (
                <div className="flex flex-row w-11/12 m-1" key={group.id}>
                  <div className="flex flex-row bg-purple-500 justify-between items-center w-full px-3 h-16 rounded-l-3xl text-2xl shadow-md">
                    {group.id}
                    {isLatestMessageRead(group) ? (
                      <div className="flex text-neutral-700 bg-amber-500 h-1/2 items-center justify-center px-2 rounded-lg">
                        <p>
                          {lastOpenedByUser &&
                            lastOpenedByUser.lastOpened
                              .toDate()
                              .toDateString()
                              .toString() +
                              " " +
                              lastOpenedByUser.lastOpened
                                .toDate()
                                .toLocaleTimeString()
                                .toString()}
                        </p>
                      </div>
                    ) : (
                      <div className="flex bg-emerald-700 text-lime-400 h-1/2 justify-center items-center px-2 rounded-lg text-xl">
                        New:{" "}
                        {latestMessage && latestMessage.data()
                          ? latestMessage.data()!.sentBy
                          : "NO ONE"}
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-400 w-1/6 h-full rounded-r-3xl text-2xl shadow-lg"
                    onClick={() => navigateGroup(group.id)}
                  >
                    Join
                  </button>
                </div>
              );
            })}
            <div className="w-1/3 h-9">
              <button
                onClick={handleCreateGroupBtn}
                className="bg-lime-500 hover:bg-lime-400 rounded-3xl drop-shadow-md w-full h-full"
              >
                + Add a New Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
