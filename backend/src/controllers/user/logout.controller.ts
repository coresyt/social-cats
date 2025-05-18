import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../entity/User'
import { AppDataSource } from '../../data-source'

export default async function logOut(
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> {
  try {
    if (!req.headers.authorization) {
      res.status(409).json({
        message: 'You are not authenticated!!',
        code: 409
      })
      return
    }

    const token = jwt.decode(req.headers.authorization.split(' ')[1], {
      json: true
    })

    if (
      !token ||
      typeof token.email !== 'string' ||
      typeof token.password !== 'string'
    ) {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const userIsFound = await AppDataSource.getRepository(User).findOne({
      where: { email: token.email }
    })

    if (!userIsFound) {
      res
        .status(404)
        .json({ message: 'Your user is not really exist', code: 404 })
      return
    }

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(User)
      .where('email = :email', { email: token.email })
      .execute()

    res
      .status(200)
      .json({ message: 'You delete account successfully', code: 200 })
      .removeHeader('Authorization')
  } catch (err) {
    console.log(err)
    res.status(500).json()
  }
}
