import { DocumentData, DocumentSnapshot } from "firebase/firestore";

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

export interface UserInfo {
  uid: string;
  displayName: string;
  photoURL: string;
}

export interface GroupData extends DocumentData {}

export interface Group {
  id: string;
  data: GroupData;
  latestMessage?: DocumentSnapshot<DocumentData, DocumentData>;
}

export type PrivateGroupTuple = [friend: string, group: string];
