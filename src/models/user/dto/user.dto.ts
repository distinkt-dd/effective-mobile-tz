import z from 'zod'
import {
	EnumUserRoles,
	EnumUserStatus,
} from '../../../../generated/prisma/enums'

export const userCreateDto = z.object({
	firstName: z
		.string()
		.min(2, 'Имя должно быть не менее 2 символов')
		.max(50, 'Имя не должно превышать 50 символов'),
	lastName: z
		.string()
		.min(2, 'Фамилия должно быть не менее 2 символов')
		.max(50, 'Фамилия не должна превышать 50 символов'),
	middleName: z
		.string()
		.min(2, 'Фамилия должно быть не менее 2 символов')
		.max(50, 'Фамилия не должна превышать 50 символов')
		.optional()
		.nullable(),
	birthday: z
		.string()
		.datetime('Не верный формат даты!')
		.transform(str => new Date(str)),
	email: z.string().email('Не корректный email'),
	password: z.string().min(8, 'Слишком короткий пароль!'),
	role: z
		.enum(EnumUserRoles, 'Роль не соответствует доступным!')
		.default(EnumUserRoles.USER),
	status: z
		.enum(EnumUserStatus, 'Статус не соответствует доступным!')
		.default(EnumUserStatus.INACTIVE),
})

export const userLoginDto = z.object({
	email: z.string().email('Не корректный email'),
	password: z.string().min(8, 'Слишком короткий пароль!'),
})

export type TUserCreateDto = z.infer<typeof userCreateDto>
export type TUserLoginDto = z.infer<typeof userLoginDto>
