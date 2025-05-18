import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../entity/User'
import { AppDataSource } from '../../data-source'
import IUser from '../../types/User'

export default async function searchProfiles(
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

    const query = req.query.q
    const users = (await AppDataSource.getRepository(User).find())
    let profiles: IUser[]
    let usersFilter: IUser[]

    if (token !== null && typeof token.email === 'string') {
      usersFilter = [...users].filter(({ email }) => email !== token.email)
    } else {
      usersFilter = users
    }

    if (!query || typeof query !== 'string') {
      profiles = usersFilter
    } else {
      profiles = [...usersFilter].filter((p) =>
        p.username.toLowerCase().includes(query.toLocaleLowerCase())
      )
    }

    res.status(200).json({ profiles, code: 200 })
    return
  } catch (error) {
    console.log(error)
    res.status(500).json()
  }
}
