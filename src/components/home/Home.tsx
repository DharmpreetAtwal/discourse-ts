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
import { UserIDStateContext } from "../../App";
import { useEnableOnlinePresence } from "../../hooks/useEnableOnlinePresence";
import { PublicGroupHomeTag } from "./PublicGroupHomeTag";

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

  return (
    <>
      {user && (
        <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            {/* User Profile Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="h-14 w-14 rounded-full object-cover ring-4 ring-white/50 ring-offset-2 ring-offset-purple-400 shadow-xl"
                  src={`${user.photoURL}`}
                  alt="User profile"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 bg-emerald-400 border-3 border-white rounded-full shadow-lg animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white drop-shadow-md">{user.displayName}</h2>
                <p className="text-sm text-purple-100 font-medium">Online</p>
              </div>
            </div>

            {/* App Title */}
            <div className="hidden md:flex items-center">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Discourse
              </h1>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Sign Out
            </button>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Friends Sidebar */}
            <aside className="w-1/3 bg-gradient-to-b from-blue-500 to-cyan-500 shadow-xl flex flex-col">
              <div className="px-6 py-5 border-b border-blue-400/50 bg-blue-600/30 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Friends & Chats
                </h2>
                <p className="text-sm text-blue-100 mt-1 font-medium">Your connections</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {fetchedPublicGroups && <Friend userID={user.uid} />}
              </div>
            </aside>

            {/* Public Groups Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 shadow-md">
                <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Public Groups
                </h2>
                <p className="text-sm text-purple-100 mt-1 font-medium">Join conversations and create new groups</p>
              </div>

              {/* Groups List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {publicGroups.map((group) => {
                  return <PublicGroupHomeTag key={group.id} group={group} />;
                })}

                {/* Create New Group Button */}
                <div className="flex justify-center pt-4 pb-6">
                  <button
                    onClick={handleCreateGroupBtn}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 hover:-translate-y-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create New Group</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
