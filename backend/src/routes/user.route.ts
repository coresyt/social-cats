import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router()

userRouter.get('/users/profile/', userController.getProfile)

userRouter.post('/users/info/', userController.updateInfo)

userRouter.post('/users/login', userController.logIn)

userRouter.post('/users/signup', userController.signUp)

export default userRouter
