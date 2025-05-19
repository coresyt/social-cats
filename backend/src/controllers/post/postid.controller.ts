import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { PostLike } from '../../entity/PostLike'
import { Post } from '../../entity/Post'

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
        .getMany()
    
      let likeForPost = 0

      postsLikes.map(({ postId }) => postId === postFound.id && likeForPost++)

      const post = {
        ...postFound,
        likes: likeForPost
      }
    
    res.status(200).json({ post, code: 200 })
    return
  } catch (err) {
    console.log(err)
    res.status(500).json()
    return
  }
}