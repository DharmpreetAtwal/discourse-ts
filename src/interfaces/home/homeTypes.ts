import { Timestamp } from "firebase/firestore";
import { Message } from "../group/groupTypes";

export interface LastOpenByUser {
  userID: string;
  lastOpened: Timestamp;
}

export interface GroupData {
  creatorID: string;
  isPrivate: boolean;
  lastOpenedByUser?: LastOpenByUser[];
  latestMessage?: Message | null;
  members: string[];
}
