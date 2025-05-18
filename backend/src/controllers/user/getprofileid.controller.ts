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
      .where('user.user_id = :id', { id: req.params.userId })
      .getOne()

    const followers = await AppDataSource.getRepository(Follow)
      .createQueryBuilder('follow')
      .where('follow.followee = :id', { id: req.params })
      .getMany()

    if (userFound === null) {
      res
        .status(404)
        .json({ message: 'Your user searched is not exist', code: 404 })
      return
    }

    let followersCount = 0
    let followingsCount = 0

    followers.map(({ followeeId, followerId }) => {
      if (followeeId === userFound.id) followersCount += 1
      if (followerId === userFound.id) followingsCount += 1
    })

    res.status(200).json({
      info: {
        ...userFound,
        password: '',
        followers: followersCount,
        followings: followingsCount
      } as typeof userFound,
      code: 200
    })
  } catch (error) {
    console.log(error)
    res.status(500).json()
  }
}
