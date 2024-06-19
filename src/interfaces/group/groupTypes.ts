import { Timestamp } from "firebase/firestore";
import { UserInfo } from "../types";
import { GroupData } from "../home/homeTypes";

export interface GroupProps {
  isPrivate: boolean;
}

export interface GroupDisplayProps {
  userID: string;
  groupID: string;
  isPrivate: boolean;
  isSidebarVisible: boolean;
}

export interface PublicGroupHomeTageProps {
  group: Group;
}

export interface Sidebar {
  members: UserInfo[];
  isPrivate: boolean;
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
