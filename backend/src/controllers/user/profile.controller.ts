import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../entity/User'
import { AppDataSource } from '../../data-source'
import { Follow } from '../../entity/Follow'

export default async function getProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.headers.authorization) {
      res.status(404).json({
        message: 'Your token not exist in header Authorization',
        code: 404
      })
      return
    }

    console.log(req.headers.authorization.split(' ')[1])
    const token = jwt.decode(req.headers.authorization.split(' ')[1], {
      json: true
    })
    console.log(token)

    if (token === null || typeof token.email !== 'string') {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const userFound = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: token.email })
      .getOne()
      
    if (userFound === null) {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const followers = await AppDataSource.getRepository(Follow)
      .createQueryBuilder('follow')
      .where('follow.follower_id = :id', { id: userFound.id })
      .getCount()

    const following = await AppDataSource.getRepository(Follow)
      .createQueryBuilder('follow')
      .where('follow.followee_id = :id', { id: userFound.id })
      .getCount()

    res.status(200).json({
      info: {
        ...userFound,
        password: '',
        followers: followers,
        followings: following
      } as typeof userFound,
      code: 200
    })
  } catch (error) {
    console.log(error)
    res.status(500).json()
  }
}
