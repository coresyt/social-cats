import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import IUser from '../types/User'
import timestamp from 'time-stamp'

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string

  @Column({ type: 'varchar', length: 255 })
  password: string

  @Column({ type: 'text', nullable: true })
  bio: string

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string

  @Column({ name: 'created_at', type: 'varchar', default: timestamp('[DD/MM/YYYY] HH:mm') })
  createdAt: string
}
