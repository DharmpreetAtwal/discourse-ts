import { UserInfo } from "../types";

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
