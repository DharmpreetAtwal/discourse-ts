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

export interface UserInfo {
  uid: string | null;
  displayName: string;
  photoURL: string;
}
