import { Timestamp } from "firebase/firestore";
import { UserInfo } from "../types";
import { GroupData } from "../home/homeTypes";

export interface GroupProps {
  userID: string;
  isPrivate: boolean;
}

export interface Sidebar {
  members: UserInfo[];
  isPrivate: boolean;
  addMemberInputRef: React.RefObject<HTMLInputElement>;
  groupID: string | undefined;
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

export interface MessageTag {
  sender: UserInfo;
  msg: Message;
}
