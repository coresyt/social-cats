import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { Comment } from '../../entity/Comment'
import IComment from '../../types/Comment'

export default async function changeCommentForPost(req: Request<{ commentId: string }>, res: Response): Promise<void> {
  try {
      const body = req.body as IComment | null
  
      if (!body || typeof body.content !== 'string') {
        res.status(409).json({
          message: 'You can\'t change the author or submit empty data!!',
          code: 409
        })
        return
      }
  
      const { affected } = await AppDataSource
        .createQueryBuilder()
        .update(Comment)
        .set({
          content: body.content
        })
        .where('id = :id', { id: req.params.commentId })
        .execute()
  
      if (!affected || affected <= 0) {
        res.status(404).json()
        return
      }
      
      res.status(201).json({ message: 'Your comment updated successfully', code: 201 })
      return
    } catch(err) {
      console.log(err)
      res.status(500).json()
      return
    }
}
