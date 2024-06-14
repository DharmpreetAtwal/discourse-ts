export interface AuthProps {
  // setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  // setUserID: React.Dispatch<React.SetStateAction<string>>;
  setDisplayName: React.Dispatch<React.SetStateAction<string | null>>;
  setPhotoURL: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UserInfo {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  friends: string[];
  pendingFriends: string[];
  privateGroups: string[];
}

export interface PrivateGroup {
  friend: string;
  groupID: string;
}

export interface OnlineFriend {
  friendID: string;
  isOnline: boolean;
}
