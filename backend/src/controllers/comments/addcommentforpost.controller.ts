import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../data-source'
import { Comment } from '../../entity/Comment'
import IComment from '../../types/Comment'
import { User } from '../../entity/User'

export default async function addCommentForPost(req: Request<{ postId: string }>, res: Response): Promise<void> {
  try {
      if (!req.headers.authorization) {
        res.status(404).json({
          message: 'Your token not exist in header Authorization',
          code: 404
        })
        return
      }
  
      const body = req.body as IComment | null
      const token = jwt.decode(req.headers.authorization.split(' ')[1], { json: true })
  
      if (!body || typeof body.content !== 'string' || typeof req.params.postId !== 'string' || !token || typeof token.email !== 'string') {
        res.status(409).json({
          message: 'Missing information required!!',
          code: 409
        })
        return
      }
  
      const userFound = await AppDataSource.getRepository(User).findOne({ where: { email: token.email }, select: { id: true } })
      if (userFound === null) {
        res.status(404).json({ message: 'Your user is not really exist', code: 404 })
        return
      }
  
      await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values({
          authorId: userFound.id,
          content: body.content,
          postId: req.params.postId
        })
        .execute()
      
      res.status(201).json({ message: 'Your comment created successfully', code: 201 })
      return
    } catch(err) {
      console.log(err)
      res.status(500).json()
      return
    }
}
