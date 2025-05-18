import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { PostLike } from '../entity/PostLike'
import { Post } from '../entity/Post'
import IPost from '../types/Post'
import { User } from '../entity/User'

const postsList = async (req: Request, res: Response): Promise<void> => {
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

const postId = async (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> => {
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

const postCreate = async (req: Request, res: Response): Promise<void> => {
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

const postUpdate = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
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

const postLike = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
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

const postUnlike = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
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

    if (existLike === false) {
      res.status(409).json({
        message: 'You already gave it a like!!!',
        code: 409
      })
    }

    await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(PostLike)
      .where('post_id = :post', { post: req.params.postId })
      .andWhere('user_id = :id', { id: userFound.id })
      .execute()
    
    res.status(201).json({ message: 'Your delete like successfully', code: 201 })
    return
  } catch(err) {
    console.log(err)
    res.status(500).json()
    return
  }

}

export default {
  postsList,
  postId,
  postCreate,
  postUpdate,
  postLike,
  postUnlike
}
