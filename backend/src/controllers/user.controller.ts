import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../entity/User'
import { AppDataSource } from '../data-source'
import { errorMessage, SECRET_KEY } from '../env'
import type IUser from '../types/User'

const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.headers.authorization) {
      res.status(404).json({
        message: 'Your token not exist in header Authorization',
        code: 404
      })
      return
    }

    console.log(req.headers.authorization.split(' ')[1])
    const token = jwt.decode(req.headers.authorization.split(' ')[1], {
      json: true
    })
    console.log(token)

    if (
      token === null ||
      typeof token.email !== 'string' ||
      typeof token.password !== 'string'
    ) {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const userFound = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: token.email })
      .getOne()
    if (userFound === null) {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const isEqual = await bcrypt.compare(token.password, userFound.password)
    if (isEqual === false) {
      res.status(404).json({ message: 'Your token is not valid', code: 404 })
      return
    }

    res.status(200).json({
      info: { ...userFound, password: '' } as typeof userFound,
      code: 200
    })
  } catch (error) {
    console.log(error)
    res.status(500).json()
  }
}

const updateInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    if (
      !token ||
      typeof token.email !== 'string' ||
      typeof token.password !== 'string'
    ) {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const userFound = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: token.email })
      .getOne()
    if (
      !userFound ||
      typeof userFound.email !== 'string' ||
      typeof userFound.password !== 'string'
    ) {
      res.status(404).json({ message: 'Your token not is valid', code: 404 })
      return
    }

    const isEqual = await bcrypt.compare(token.password, userFound.password)
    if (isEqual === false) {
      res.status(404).json({ message: 'Your token is not valid', code: 404 })
      return
    }

    if (req.body.password) {
      res.status(404).json({ message: 'Your request is invalid', code: 400 })
      return
    }

    const { avatarUrl, bio, email, username, password, ..._ } = req.body as IUser

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

const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

const signUp = async (req: Request, res: Response) => {
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

export default { getProfile, updateInfo, logIn, signUp }
