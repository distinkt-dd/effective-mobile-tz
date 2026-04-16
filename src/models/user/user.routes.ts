import {
	authenticateJWT,
	requireActive,
	requireRole
} from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { Router } from 'express'
import { userCreateDto, userLoginDto } from './dto/user.dto'
import { UserController } from './user.controller'
import { UserService } from './user.service'

export const userRouter = Router()
const userService = new UserService()
const userController = new UserController(userService)

userRouter.post(
	'/registration',
	validate(userCreateDto),
	userController.register.bind(userController)
)

userRouter.post(
	'/auth',
	validate(userLoginDto),
	userController.login.bind(userController)
)

userRouter.get(
	'/getAllUsers',
	authenticateJWT,
	requireRole(['ADMIN']),
	requireActive,
	userController.getAllUsers.bind(userController)
)

userRouter.get(
	'/getUserById/:userId',
	authenticateJWT,
	requireActive,
	userController.getUserById.bind(userController)
)

userRouter.post(
	'/blockedUser/:userId',
	authenticateJWT,
	requireActive,
	userController.blockedUser.bind(userController)
)

userRouter.post(
	'/unBlockedUser/:userId',
	authenticateJWT,
	requireActive,
	userController.unBlockedUser.bind(userController)
)
