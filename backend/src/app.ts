import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './routes/user.route'

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(cors({ origin: '*' }))

app.use('/api/', userRouter)

export default app
