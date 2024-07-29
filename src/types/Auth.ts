import {Post} from './Post';
import {CurrentUserInfo} from './Profile';

export interface SignUpUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
}
export interface LoginUser {
  email: string;
  password: string;
}
export interface User {
  email: string;
  followers: string[];
  following: string[];
  fullName: string;
  posts: Post[];
  userId: string;
  userInforef: string;
  username: string;
  userBio: string;
  userAvatar: string;
  userCoverImage: string;
  userInfo: CurrentUserInfo;
  isVerifiedUser?: boolean;
}

export interface AuthContextType {
  currentUser: User | null;
}
