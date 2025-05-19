import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../data-source'
import { Post } from '../../entity/Post'
import IPost from '../../types/Post'
import { User } from '../../entity/User'

export default async function postCreate (req: Request, res: Response): Promise<void> {
  try {
    if (!req.headers.authorization) {
      res.status(404).json({
        message: 'Your token not exist in header Authorization',
        code: 404
      })
      return
    }

    const body = req.body as IPost | null
    const token = jwt.decode(req.headers.authorization.split(' ')[1], { json: true })

    if (!body || typeof body.content !== 'string' || typeof body.imageUrl !== 'string' || !token || typeof token.email !== 'string') {
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
      .into(Post)
      .values({
        authorId: userFound.id,
        content: body.content,
        imageUrl: body.imageUrl,
      })
      .execute()
    
    res.status(201).json({ message: 'Your post created successfully', code: 201 })
    return
  } catch(err) {
    console.log(err)
    res.status(500).json()
    return
  }
}