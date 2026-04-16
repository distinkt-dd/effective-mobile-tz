import { Request, Response } from 'express'
import { UserService } from './user.service'
export class UserController {
	constructor(private userService: UserService) {}

	async register(req: Request, res: Response) {
		try {
			const result = await this.userService.register(req.body)

			res.status(201).json({
				success: true,
				data: result,
			})
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json({
					success: false,
					message: error.message,
				})
			} else {
				res.status(500).json({
					success: false,
					message: 'Внутренняя ошибка сервера',
				})
			}
		}
	}
}
