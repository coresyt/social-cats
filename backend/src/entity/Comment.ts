import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import timestamp from 'time-stamp'
import IComment from '../types/Comment'

@Entity('comments')
export class Comment implements IComment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  content: string
  
  @PrimaryColumn({ name: 'post_id', type: 'uuid' })
  postId: string
  
  @PrimaryColumn({ name: 'author_id', type: 'uuid' })
  authorId: string
  
  @Column({
    name: 'created_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  createdAt: string
}
