import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { IPostLike } from '../types/PostLike'
import timestamp from 'time-stamp'
import { User } from './User'
import { Post } from './Post'

@Entity('post_likes')
export class PostLike implements IPostLike {
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post
  
  @PrimaryColumn({ name: 'post_id', type: 'string' })
  postId: string
  
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User
  
  @PrimaryColumn({ name: 'user_id', type: 'string' })
  userId: string
  
  @Column({
    name: 'liked_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  likedAt: string
}
