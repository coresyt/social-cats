import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { PostLike } from '../../entity/PostLike'
import { Post } from '../../entity/Post'
import { Comment } from '../../entity/Comment'

export default async function postId (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> {
  try {
    console.log(req.params.postId)
    const postFound = await AppDataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :id', { id: req.params.postId })
      .getOne()

      if (postFound === null) {
        res.status(404).json({ message: 'This post is not exist', code: 404 })
        return
      }

      const postsLikes = await AppDataSource
        .getRepository(PostLike)
        .createQueryBuilder('post_like')
        .where('post_like.post_id = :id', { id: req.params.postId })
        .getCount()
      
      const comments = await AppDataSource
        .getRepository(Comment)
        .createQueryBuilder('comment')
        .where('comment.post_id = :id', { id: req.params.postId })
        .getMany()

      const post = {
        ...postFound,
        likes: postsLikes,
        comments
      }
    
    res.status(200).json({ post, code: 200 })
    return
  } catch (err) {
    console.log(err)
    res.status(500).json()
    return
  }
}