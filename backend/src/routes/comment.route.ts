import { Router } from 'express'
import commentController from '../controllers/comments.controller'
import checkAuthentication from '../middlewares/authentication'

const commentRouter = Router()

commentRouter.post('/comment/create/:postId', checkAuthentication, commentController.addCommentForPost)

commentRouter.post('/comment/update/:commentId', checkAuthentication, commentController.changeCommentForPost)

commentRouter.delete('/comment/delete/:commentId', checkAuthentication, commentController.deleteCommentForPost)

export default commentRouter
