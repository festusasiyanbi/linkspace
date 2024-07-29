export interface Post {
  postId: string;
  email: string;
  name: string;
  username: string;
  userId: string;
  images: string[];
  isVerifiedUser: boolean | string;
  date: Date;
  caption: string;
  commentCount: [];
  likeCount: [];
  bookmarkCount: [];
  shareCount: [];
  userAvatar: string;
}
