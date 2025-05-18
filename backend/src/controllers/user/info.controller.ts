import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../entity/User'
import { AppDataSource } from '../../data-source'
import type IUser from '../../types/User'

export default async function updateInfo(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.headers.authorization) {
      res.status(404).json({
        message: 'Your token not exist in header Authorization',
        code: 404
      })
      return
    }

    const token = jwt.decode(req.headers.authorization.split(' ')[1], {
      json: true
    })

    if (!token || typeof token.email !== 'string') {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const { avatarUrl, bio, email, username, password } =
      req.body as IUser

    const { affected } = await AppDataSource.createQueryBuilder()
      .update(User)
      .set({
        avatarUrl,
        bio,
        email,
        username,
        password
      })
      .where('email = :email', { email: token.email })
      .execute()

    if (!affected || affected <= 0) {
      res.status(404).json()
      return
    }

    res.status(200).json({ message: 'Info updated successfully!!', code: 201 })
  } catch (error) {
    console.log(error)
    res.status(500).json()
  }
}
