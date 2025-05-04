import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import IFollow from '../types/Follow'
import timestamp from 'time-stamp'
import { User } from './User'

@Entity('follows')
export class Follow implements IFollow {
  @PrimaryColumn({ name: 'follower_id', type: 'string' })
  followerId: string

  @PrimaryColumn({ name: 'followee_id', type: 'string' })
  followeeId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followee_id' })
  followee: User

  @Column({
    name: 'followed_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  followedAt: string
}
