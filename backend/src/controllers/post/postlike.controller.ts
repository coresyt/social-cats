import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../data-source'
import { PostLike } from '../../entity/PostLike'
import { User } from '../../entity/User'

export default async function postLike (req: Request<{ postId: string }>, res: Response): Promise<void> {
  try {
    if (!req.headers.authorization) {
      res.status(404).json({
        message: 'Your token not exist in header Authorization',
        code: 404
      })
      return
    }

    const token = jwt.decode(req.headers.authorization.split(' ')[1], { json: true })

    if (!token || typeof token.email !== 'string') {
      res.status(409).json({
        message: 'Your token is invalid!!',
        code: 409
      })
      return
    }

    const userFound = await AppDataSource.getRepository(User).findOne({ where: { email: token.email }, select: { id: true } })
    if (userFound === null) {
      res.status(404).json({ message: 'Your user is not really exist', code: 404 })
      return
    }

    const existLike = await AppDataSource
      .getRepository(PostLike)
      .createQueryBuilder('post')
      .where('post_id = :post', { post: req.params.postId })
      .andWhere('user_id = :id', { id: userFound.id })
      .getExists()

    if (existLike === true) {
      res.status(409).json({
        message: 'You already gave it a like!!!',
        code: 409
      })
    }
    
    await AppDataSource
      .createQueryBuilder()
      .insert()
      .into(PostLike)
      .values({
        postId: req.params.postId,
        userId: userFound.id
      })
      .execute()
    
    res.status(201).json({ message: 'Your add like successfully', code: 201 })
    return
  } catch(err) {
    console.log(err)
    res.status(500).json()
    return
  }
}