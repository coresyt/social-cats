import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../entity/User'
import { AppDataSource } from '../../data-source'
import { errorMessage, SECRET_KEY } from '../../env'

export default async function logIn (
  req: Request,
  res: Response,
  
): Promise<void> {
  try {
    if (req.headers.authorization) {
      res.status(409).json({
        message: 'Your were already authenticated!!',
        code: 409
      })
      return
    }

    const { email, passwordHashed } = req.body
    if (typeof email !== 'string' || typeof passwordHashed !== 'string') {
      res.status(409).json({
        message: 'Missing password or email!!',
        code: 409
      })
      return
    }

    const userFound = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne()

    if (userFound === null) {
      res.status(404).json({ message: 'Your user is not exist', code: 404 })
      return
    }

    const isEqual = await bcrypt.compare(passwordHashed, userFound.password)
    if (isEqual === false) {
      res.status(404).json({ message: 'Your user is not exist', code: 404 })
      return
    }

    if (typeof SECRET_KEY !== 'string')
      throw new Error(errorMessage('SECRET_KEY'))
    const token = jwt.sign({ email, passwordHashed }, SECRET_KEY)

    res
      .status(200)
      .set('authorization', `Basic ${token}`)
      .json({ message: 'You are already logged in', code: 200, token })
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
}