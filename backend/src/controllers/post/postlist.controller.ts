import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { PostLike } from '../../entity/PostLike'
import { Post } from '../../entity/Post'

export default async function postsList (req: Request, res: Response): Promise<void> {
  try {
    const query = req.query.q
    let posts
    const postsReceived = await AppDataSource.getRepository(Post).find()
    const postsLikes = await AppDataSource.getRepository(PostLike).find()

    if (query && typeof query === 'string') {
      posts = postsReceived.filter((p) =>
        p.content.toLowerCase().includes(query.toLocaleLowerCase())
      )
      console.log(query)
    } else {
      posts = postsReceived
    }

    const postsWithLikes = [...posts].map((p) => {
      let likeForPost = 0

      postsLikes.map(({ postId }) => postId === p.id && likeForPost++)

      return {
        ...p,
        likes: likeForPost
      }
    })

    res.status(200).json({ posts: postsWithLikes, code: 200 })
    return
  } catch (err) {
    console.log(err)
    res.status(500).json()
    return
  }
}