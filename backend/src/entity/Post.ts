import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from 'typeorm'
import IPost from '../types/Post'
import timestamp from 'time-stamp'
import { User } from './User'

@Entity('posts')
export class Post implements IPost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  content: string

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string
  
  @PrimaryColumn({ name: 'followee_id', type: 'string' })
  author: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  authorId: string

  @Column({
    name: 'created_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  createdAt: string
}
