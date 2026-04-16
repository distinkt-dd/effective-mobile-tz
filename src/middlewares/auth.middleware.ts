import { IAuthRequestUser } from '@/models/user/types/user.types'
import { UserService } from '@/models/user/user.service'
import { NextFunction, Response } from 'express'
import passport from 'passport'
import {
	ExtractJwt,
	Strategy as JwtStrategy,
	StrategyOptions
} from 'passport-jwt'
import { EnumUserRoles, EnumUserStatus } from '../../generated/prisma/enums'

declare global {
	namespace Express {
		interface User {
			id: string
			email: string
			firstName: string
			lastName: string
			role: EnumUserRoles
			status: EnumUserStatus
		}
	}
}

const userService = new UserService()

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey:
		process.env.JWT_SECRET || 'KdTTKNigGldokK6A9HLvaB8LG44F3rifUkssODdd3tr',
	ignoreExpiration: false
}

export interface JwtPayload {
	id: string
	email: string
	role: EnumUserRoles
}

passport.use(
	new JwtStrategy(options, async (payload: JwtPayload, done) => {
		try {
			const user = await userService.findUserById(payload.id)

			if (!user) {
				return done(null, false, { message: 'Пользователь не найден' })
			}

			if (user.banAt) {
				return done(null, false, { message: 'Аккаунт заблокирован' })
			}

			return done(null, {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role as EnumUserRoles,
				status: user.status as EnumUserStatus
			})
		} catch (error) {
			return done(error, false)
		}
	})
)

export const authenticateJWT = passport.authenticate('jwt', { session: false })

export const requireRole = (allowedRoles: String[]) => {
	return (req: IAuthRequestUser, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ error: 'Пользователь не авторизован' })
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				error: `Недостаточно прав для выполнения действия!`
			})
		}

		next()
	}
}

export const requireActive = (
	req: IAuthRequestUser,
	res: Response,
	next: NextFunction
) => {
	if (!req.user) {
		return res.status(401).json({ error: 'Пользователь не авторизован' })
	}

	if (req.user.status !== 'ACTIVE') {
		return res.status(403).json({
			error:
				'Аккаунт не активен или заблокирован. Активируйте через почту или обратитесь к администратору'
		})
	}

	next()
}
