import { Post } from "../entity/Post";
import { User } from "../entity/User";

export interface IPostLike {
  userId: string;
  user: User;
  postId: string;
  post: Post;
  likedAt: string
}