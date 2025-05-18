import { Request, Response } from 'express'
import { User } from '../../entity/User'
import { Follow } from '../../entity/Follow'
import { AppDataSource } from '../../data-source'

export default async function getProfileId(
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> {
  try {
    const userFound = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: req.params.userId })
      .getOne()


    if (userFound === null) {
      res
        .status(404)
        .json({ message: 'Your user searched is not exist', code: 404 })
      return
    }

    const followers = await AppDataSource.getRepository(Follow)
      .createQueryBuilder('follow')
      .where('follow.follower_id = :id', { id: userFound.id })
      .getCount()

    const following = await AppDataSource.getRepository(Follow)
      .createQueryBuilder('follow')
      .where('follow.followee_id = :id', { id: userFound.id })
      .getCount()

    res.status(200).json({
      info: {
        ...userFound,
        password: '',
        followers,
        following
      } as typeof userFound,
      code: 200
    })
  } catch (error) {
    console.log(error)
    res.status(500).json()
  }
}
