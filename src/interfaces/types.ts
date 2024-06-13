import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface AuthProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
  setDisplayName: React.Dispatch<React.SetStateAction<string | null>>;
  setPhotoURL: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface GroupProps {
  userID: string;
  isPrivate: boolean;
}

export interface HomeProps {
  userID: string;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string | null;
  photoURL: string | null;
}

export interface FriendProps {
  userID: string;
}

export interface FriendTagProps {
  friendInfo: UserInfo;
  privateGroup: string | null;
  userID: string;
}

export interface PendingFriendsTagProps {
  friendInfo: UserInfo;
  userID: string;
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

export interface LastOpenByUser {
  userID: string;
  lastOpened: Timestamp;
}

export interface GroupData {
  creatorID: string;
  isPrivate: boolean;
  lastOpenedByUser?: LastOpenByUser[];
  latestMessage?: DocumentSnapshot<DocumentData, DocumentData>;
  members: string[];
}

export interface Group {
  id: string;
  data: GroupData;
}

export interface Message {
  id: string;
  createdAt: Timestamp;
  message: string;
  sentBy: string;
}

export interface PrivateGroup {
  friend: string;
  groupID: string;
}

export interface OnlineFriend {
  friendID: string;
  isOnline: boolean;
}
