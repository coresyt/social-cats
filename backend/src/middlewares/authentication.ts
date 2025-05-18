import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export default async function checkAuthentication(req: Request, res: Response, next: NextFunction) {
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

    next()
    return
}