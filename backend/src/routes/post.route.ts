import postController from '../controllers/post.controller'
import { Router } from 'express'
import checkAuthentication from '../middlewares/authentication'

const postRouter = Router()

postRouter.get('/post/list', postController.postsList)

postRouter.get('/post/:postId', postController.postId)

postRouter.post('/post/create/', checkAuthentication, postController.postCreate)

postRouter.post('/post/update/:postId', checkAuthentication, postController.postUpdate)

postRouter.delete('/post/delete/:postId', checkAuthentication, postController.postDelete)

postRouter.post('/post/like/:postId', checkAuthentication, postController.postLike)

postRouter.delete('/post/unlike/:postId', checkAuthentication, postController.postUnlike)

export default postRouter
