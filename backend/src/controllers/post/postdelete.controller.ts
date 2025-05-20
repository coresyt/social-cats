import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../data-source'
import { Post } from '../../entity/Post'
import { User } from '../../entity/User'

export default async function postDelete (req: Request<{ postId: string }>, res: Response): Promise<void> {
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

    const existPost = await AppDataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :post', { post: req.params.postId })
      .getExists()

    if (existPost === false) {
      res.status(409).json({
        message: 'You already gave it a create post!!!',
        code: 409
      })
    }

    await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('id = :post', { post: req.params.postId })
      .execute()
    
    res.status(201).json({ message: 'Your delete post successfully', code: 201 })
    return
  } catch(err) {
    console.log(err)
    res.status(500).json()
    return
  }
}