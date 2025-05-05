import { Column, Entity, PrimaryColumn } from 'typeorm'
import { IPostLike } from '../types/PostLike'
import timestamp from 'time-stamp'

@Entity('post_likes')
export class PostLike implements IPostLike {
  @PrimaryColumn({ name: 'post_id', type: 'uuid' })
  postId: string
  
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string
  
  @Column({
    name: 'liked_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  likedAt: string
}
