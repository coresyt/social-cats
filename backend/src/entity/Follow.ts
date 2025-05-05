import { Column, Entity, PrimaryColumn } from 'typeorm'
import IFollow from '../types/Follow'
import timestamp from 'time-stamp'

@Entity('follows')
export class Follow implements IFollow {
  @PrimaryColumn({ name: 'follower_id', type: 'uuid' })
  followerId: string

  @PrimaryColumn({ name: 'followee_id', type: 'uuid' })
  followeeId: string

  @Column({
    name: 'followed_at',
    type: 'varchar',
    default: timestamp('[DD/MM/YYYY] HH:mm')
  })
  followedAt: string
}
