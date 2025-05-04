import { User } from "../entity/User"

export default interface IPost {
  id: string
  authorId: string
  author: User
  content: string
  imageUrl: string
  createdAt: string
}