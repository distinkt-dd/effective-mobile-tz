import prisma from '@/prisma'
import { TRegisterUser } from './types/user.types'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { EnumUserRoles, EnumUserStatus } from '../../../generated/prisma/enums'
import { TUserCreateDto, TUserLoginDto } from './dto/user.dto'

export class UserService {
	async findUserByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email }
		})
	}

	async register(dto: TUserCreateDto) {
		const existingUser = await this.findUserByEmail(dto.email)

		if (existingUser) {
			throw new Error('Пользователь с таким Email уже существует!')
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10)

		const data: TRegisterUser = {
			firstName: dto.firstName,
			lastName: dto.lastName,
			middleName: dto.middleName || null,
			birthday: dto.birthday,
			email: dto.email,
			password: hashedPassword,
			status: EnumUserStatus.INACTIVE,
			role: EnumUserRoles.USER
		}

		const newUser = await prisma.user.create({
			data: data,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				middleName: true,
				birthday: true,
				email: true,
				role: true,
				status: true,
				createAt: true
			}
		})
		return {
			user: newUser,
			message: 'Регистрация успешна. Подтвердите email для активации аккаунта.'
		}
	}

	async login(dto: TUserLoginDto) {
		const user = await this.findUserByEmail(dto.email)

		if (!user) {
			throw new Error('Не верный email или пароль!')
		}

		const isPasswordValid = await bcrypt.compare(dto.password, user.password)

		if (!isPasswordValid) {
			throw new Error('Неверный email или пароль')
		}

		if (user.banAt && user.banAt <= new Date()) {
			throw new Error('Аккаунт заблокирован. Обратитесь к администратору.')
		}

		if (user.status === EnumUserStatus.INACTIVE) {
			throw new Error('Аккаунт не активирован! Подтвердите email!')
		}

		const payload = {
			id: user.id,
			email: user.email,
			role: user.role
		}

		const token = jwt.sign(
			payload,
			process.env.JWT_SECRET || 'KdTTKNigGldokK6A9HLvaB8LG44F3rifUkssODdd3tr',
			{ expiresIn: '7d' }
		)

		const { password, ...safeUser } = user

		return {
			user: safeUser,
			token,
			message: 'Вход выполнен успешно'
		}
	}

	async getUserById(
		userId: string,
		ownerRole: string,
		currentUserId: string,
		currentUserRole: string
	) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				middleName: true,
				birthday: true,
				email: true,
				role: true,
				status: true,
				createAt: true,
				updateAt: true,
				banAt: true
			}
		})

		if (!user) {
			throw new Error('Пользователь не найден')
		}

		if (currentUserRole !== ownerRole && currentUserId !== userId) {
			throw new Error('Доступ запрещен. Вы можете просматривать только себя.')
		}

		return user
	}

	async getAllUsers() {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				firstName: true,
				lastName: true,
				middleName: true,
				birthday: true,
				email: true,
				role: true,
				status: true,
				createAt: true,
				updateAt: true,
				banAt: true
			},
			orderBy: {
				createAt: 'desc'
			}
		})

		return users
	}

	async blockUser(
		userIdToBlock: string,
		ownerRole: string,
		currentUserId: string,
		currentUserRole: string
	) {
		const canBlock =
			currentUserRole === ownerRole || currentUserId === userIdToBlock

		if (!canBlock) {
			throw new Error('Доступ запрещен. Вы можете заблокировать только себя.')
		}

		const userToBlock = await prisma.user.findUnique({
			where: { id: userIdToBlock }
		})

		if (!userToBlock) {
			throw new Error('Пользователь не найден')
		}

		if (userToBlock.banAt !== null) {
			throw new Error('Пользователь уже заблокирован')
		}

		const blockedUser = await prisma.user.update({
			where: { id: userIdToBlock },
			data: {
				status: EnumUserStatus.INACTIVE,
				banAt: new Date(),
				updateAt: new Date()
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				role: true,
				status: true,
				banAt: true
			}
		})

		const message =
			currentUserId === userIdToBlock
				? 'Вы успешно заблокировали свой аккаунт'
				: 'Пользователь успешно заблокирован'

		return {
			user: blockedUser,
			message
		}
	}

	async unblockUser(
		userId: string,
		ownerRole: string,
		currentUserRole: string
	) {
		if (currentUserRole !== ownerRole) {
			throw new Error(
				'Доступа нет. У вас не достаточно прав для разблокировки пользователя!'
			)
		}

		const user = await prisma.user.findUnique({
			where: { id: userId }
		})

		if (!user) {
			throw new Error('Пользователь не найден')
		}

		if (user.banAt === null) {
			throw new Error('Пользователь не заблокирован')
		}

		const unblockedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				status: EnumUserStatus.ACTIVE,
				banAt: null,
				updateAt: new Date()
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				role: true,
				status: true
			}
		})

		return {
			user: unblockedUser,
			message: 'Пользователь успешно разблокирован'
		}
	}

	async findUserById(id: string) {
		return prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				middleName: true,
				birthday: true,
				email: true,
				role: true,
				status: true,
				createAt: true,
				banAt: true
			}
		})
	}
}
