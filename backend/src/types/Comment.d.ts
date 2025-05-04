import { Post } from "../entity/Post";
import { User } from "../entity/User";

export default interface IComment {
  id: string
  authorId: string;
  author: User;
  postId: string;
  post: Post;
  content: string
  createdAt: string
}