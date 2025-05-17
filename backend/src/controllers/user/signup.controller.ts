import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../entity/User'
import { AppDataSource } from '../../data-source'
import { errorMessage, SECRET_KEY } from '../../env'
import type IUser from '../../types/User'

export default async function signUp (req: Request, res: Response) {
  try {
    if (req.headers.authorization) {
      res.status(409).json({
        message: 'Your were already authenticated!!',
        code: 409
      })
      return
    }

    const body = req.body as IUser | null
    console.log(body)

    if (
      !body ||
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      typeof body.username !== 'string'
    ) {
      res.status(409).json({
        message: 'Missing information required!!',
        code: 409
      })
      return
    }

    const { username, bio, avatarUrl, email, password } = body
    
    const userIsFound = await AppDataSource.getRepository(User).exists({
      where: { email: body.email }
    })

    if (userIsFound) {
      res.status(404).json({ message: 'Your user is really exist', code: 404 })
      return
    }
    
    const salt = await bcrypt.genSalt(15)
    const passwordHashed = await bcrypt.hash(body.password, salt)

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        password: passwordHashed,
        avatarUrl: avatarUrl ?? '',
        bio: bio ?? ''
      })
      .execute()

    if (typeof SECRET_KEY !== 'string')
      throw new Error(errorMessage('SECRET_KEY'))
    const token = jwt.sign({ email: body.email, password }, SECRET_KEY)

    res
      .status(200)
      .set('authorization', `Basic ${token}`)
      .json({ message: 'You created account successfully', code: 200, token })
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
}