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
