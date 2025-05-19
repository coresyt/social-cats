import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { Comment } from '../../entity/Comment'

export default async function deleteCommentForPost(req: Request<{ commentId: string }>, res: Response): Promise<void> {
  try {
      const commentIsFound = await AppDataSource.getRepository(Comment).existsBy({ id: req.params.commentId }
      )
  
      if (commentIsFound === false) {
        res
          .status(404)
          .json({ message: 'Your comment is not really exist', code: 404 })
        return
      }
  
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Comment)
        .where('id = :id', { id: req.params.commentId })
        .execute()
  
      res
        .status(200)
        .json({ message: 'You delete comment successfully', code: 200 })
        .removeHeader('Authorization')
    } catch (err) {
      console.log(err)
      res.status(500).json()
    }
}
