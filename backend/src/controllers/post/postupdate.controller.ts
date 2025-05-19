import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { Post } from '../../entity/Post'
import IPost from '../../types/Post'

export default async function postUpdate (req: Request<{ postId: string }>, res: Response): Promise<void> {
  try {
    const body = req.body as IPost | null

    if (!body || typeof body.authorId !== 'string') {
      res.status(409).json({
        message: 'You can\'t change the author or submit empty data!!',
        code: 409
      })
      return
    }

    const { affected } = await AppDataSource
      .createQueryBuilder()
      .update(Post)
      .set({
        ...req.body
      })
      .where('id = :id', { id: req.params.postId })
      .execute()

    if (!affected || affected <= 0) {
      res.status(404).json()
      return
    }
    
    res.status(201).json({ message: 'Your post updated successfully', code: 201 })
    return
  } catch(err) {
    console.log(err)
    res.status(500).json()
    return
  }
}