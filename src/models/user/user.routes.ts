import { validate } from '@/middlewares/validate.middleware'
import { Router } from 'express'
import { userCreateDto } from './dto/user.dto'
import { UserController } from './user.controller'
import { UserService } from './user.service'

export const userRouter = Router()
const userService = new UserService()
const userController = new UserController(userService)

userRouter.post(
	'/registration',
	validate(userCreateDto),
	userController.register.bind(userController),
)
