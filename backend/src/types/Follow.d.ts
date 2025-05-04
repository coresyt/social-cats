import { User } from '../entity/User'

export default interface IFollow {
  followerId: string
  followeeId: string
  followee: User
  follower: User
  followedAt: string
}
