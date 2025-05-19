import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './routes/user.route'
import postRouter from './routes/post.route'
import commentRouter from './routes/comment.route'

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(cors({ origin: '*' }))

app.use('/api/', userRouter, postRouter, commentRouter)

export default app
