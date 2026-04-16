import { IAuthRequestUser } from '@/models/user/types/user.types'
import { UserService } from '@/models/user/user.service'
import { NextFunction, Response } from 'express'
import passport from 'passport'
import {
	ExtractJwt,
	Strategy as JwtStrategy,
	StrategyOptions,
} from 'passport-jwt'

const userService = new UserService()

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey:
		process.env.JWT_SECRET || 'KdTTKNigGldokK6A9HLvaB8LG44F3rifUkssODdd3tr',
	ignoreExpiration: false,
}

export interface JwtPayload {
	id: string
	email: string
	role: string
}

passport.use(
	new JwtStrategy(options, async (payload: JwtPayload, done) => {
		try {
			const user = await userService.findUserById(payload.id)

			if (!user) {
				return done(null, false, { message: 'Пользователь не найден' })
			}

			return done(null, user)
		} catch (error) {
			return done(error, false)
		}
	}),
)

export const authenticateJWT = passport.authenticate('jwt', { session: false })

export const requireRole = (allowedRoles: String[]) => {
	return (req: IAuthRequestUser, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ error: 'Пользователь не авторизован' })
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				error: `Недостаточно прав для выполнения действия!`,
			})
		}

		next()
	}
}

export const requireActive = (
	req: IAuthRequestUser,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		return res.status(401).json({ error: 'Пользователь не авторизован' })
	}

	if (req.user.status !== 'ACTIVE') {
		return res
			.status(403)
			.json({ error: 'Аккаунт не активен. Обратитесь к администратору.' })
	}

	next()
}
