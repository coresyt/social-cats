import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import timestamp from 'time-stamp'
import IComment from '../types/Comment'
import { User } from './User'
import { Post } from './Post'

@Entity('comments')
export class Comment implements IComment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  content: string

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post
  
  @PrimaryColumn({ name: 'post_id', type: 'string' })
  postId: string
  
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User
  
  @PrimaryColumn({ name: 'author_id', type: 'string' })
  authorId: string
  
  @Column({
    name: 'created_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  createdAt: string
}
