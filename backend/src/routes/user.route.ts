import { Router } from "express";
import userController from "../controllers/user.controller";
import checkAuthentication from "../middlewares/authentication";

const userRouter = Router()

userRouter.get('/users/profile/', checkAuthentication, userController.getProfile)

userRouter.post('/users/info/', checkAuthentication, userController.updateInfo)

userRouter.post('/users/login', userController.logIn)

userRouter.post('/users/signup', userController.signUp)

export default userRouter
