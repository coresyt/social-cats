import { Comment } from '@entity/Comment'
import { Follow } from '@entity/Follow'
import { Post } from '@entity/Post'
import { PostLike } from '@entity/PostLike'
import { User } from '@entity/User'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT, MYSQL_ROOT_PASSWORD } from './env'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  username: 'admin',
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Follow, Post, PostLike, Comment],
  subscribers: [],
  migrations: []
})
