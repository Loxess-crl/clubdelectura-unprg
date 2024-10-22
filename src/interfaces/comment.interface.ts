export interface Comment {
  id: string;
  text: string;
  likes: { [userId: string]: boolean };
  dislikes: { [userId: string]: boolean };
  createdAt: number;
  comments?: Comment | Comment[];
  userName: string;
  userAvatar: string;
}
