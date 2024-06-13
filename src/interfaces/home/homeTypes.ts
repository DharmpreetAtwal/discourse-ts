import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface HomeProps {
  userID: string;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string | null;
  photoURL: string | null;
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
