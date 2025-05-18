import { Router } from 'express'
import userController from '../controllers/user.controller'
import checkAuthentication from '../middlewares/authentication'

const userRouter = Router()

userRouter.get(
  '/users/profile/',
  checkAuthentication,
  userController.getProfile
)

userRouter.get(
  '/users/profile/:userId',
  checkAuthentication,
  userController.getProfileId
)

userRouter.get(
  '/users/search',
  checkAuthentication,
  userController.searchProfiles
)

userRouter.post('/users/info/', checkAuthentication, userController.updateInfo)

userRouter.post('/users/login', userController.logIn)

userRouter.post('/users/signup', userController.signUp)

userRouter.delete('/users/logout', checkAuthentication, userController.logOut)

export default userRouter
