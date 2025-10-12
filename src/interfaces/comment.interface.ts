import type { User } from "./user.interface";

export interface Comment {
  id: string;
  text: string;
  likes: { [userId: string]: boolean };
  dislikes: { [userId: string]: boolean };
  createdAt: number;
  comments?: Comment | Comment[];
  userId: string;
}

export interface CommentWithUser extends Comment {
  user: User;
}
