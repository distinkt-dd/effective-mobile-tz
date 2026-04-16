import { Request, Response } from 'express'
import { EnumUserRoles } from '../../../generated/prisma/enums'
import { IAuthRequestUser } from './types/user.types'
import { UserService } from './user.service'

export class UserController {
	constructor(private userService: UserService) {}

	private sendSuccess(res: Response, data: any, statusCode: number = 200) {
		return res.status(statusCode).json({
			success: true,
			data
		})
	}

	private sendError(
		res: Response,
		error: unknown,
		defaultMessage: string = 'Внутренняя ошибка сервера'
	) {
		if (error instanceof Error) {
			return res.status(400).json({
				success: false,
				message: error.message
			})
		}
		return res.status(500).json({
			success: false,
			message: defaultMessage
		})
	}

	private validateUserId(userId: any): string | null {
		if (!userId || Array.isArray(userId)) {
			return null
		}
		return userId
	}

	private checkAuth(req: IAuthRequestUser): {
		isAuth: boolean
		currentUserId?: string
		currentUserRole?: string
	} {
		const currentUserId = req.user?.id
		const currentUserRole = req.user?.role

		if (!currentUserId || !currentUserRole) {
			return { isAuth: false }
		}

		return { isAuth: true, currentUserId, currentUserRole }
	}

	private async handleRequest(
		res: Response,
		action: () => Promise<any>,
		successStatus: number = 200
	) {
		try {
			const result = await action()
			return this.sendSuccess(res, result, successStatus)
		} catch (error) {
			return this.sendError(res, error)
		}
	}

	async register(req: Request, res: Response) {
		return this.handleRequest(
			res,
			() => this.userService.register(req.body),
			201
		)
	}

	async login(req: Request, res: Response) {
		return this.handleRequest(res, () => this.userService.login(req.body))
	}

	async getAllUsers(req: Request, res: Response) {
		return this.handleRequest(res, () => this.userService.getAllUsers())
	}

	async getUserById(req: IAuthRequestUser, res: Response) {
		const userId = this.validateUserId(req.params.userId)
		if (!userId) {
			return this.sendError(
				res,
				new Error('Неверный формат ID пользователя'),
				'Неверный формат ID пользователя'
			)
		}

		const auth = this.checkAuth(req)
		if (!auth.isAuth) {
			return this.sendError(
				res,
				new Error('Пользователь не авторизован'),
				'Пользователь не авторизован'
			)
		}

		return this.handleRequest(res, () =>
			this.userService.getUserById(
				userId,
				EnumUserRoles.ADMIN,
				auth.currentUserId!,
				auth.currentUserRole!
			)
		)
	}

	async blockedUser(req: IAuthRequestUser, res: Response) {
		const userId = this.validateUserId(req.params.userId)
		if (!userId) {
			return this.sendError(
				res,
				new Error('Неверный формат ID пользователя'),
				'Неверный формат ID пользователя'
			)
		}

		const auth = this.checkAuth(req)
		if (!auth.isAuth) {
			return this.sendError(
				res,
				new Error('Пользователь не авторизован'),
				'Пользователь не авторизован'
			)
		}

		return this.handleRequest(res, () =>
			this.userService.blockUser(
				userId,
				EnumUserRoles.ADMIN,
				auth.currentUserId!,
				auth.currentUserRole!
			)
		)
	}

	async unBlockedUser(req: IAuthRequestUser, res: Response) {
		const userId = this.validateUserId(req.params.userId)
		if (!userId) {
			return this.sendError(
				res,
				new Error('Неверный формат ID пользователя'),
				'Неверный формат ID пользователя'
			)
		}

		const auth = this.checkAuth(req)
		if (!auth.isAuth) {
			return this.sendError(
				res,
				new Error('Пользователь не авторизован'),
				'Пользователь не авторизован'
			)
		}

		return this.handleRequest(res, () =>
			this.userService.unblockUser(
				userId,
				EnumUserRoles.ADMIN,
				auth.currentUserRole!
			)
		)
	}
}
