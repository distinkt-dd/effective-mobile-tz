import z from 'zod'

export const userCreateDto = z.object({
	firstName: z.string().min(2).max(50),
	lastName: z.string().min(2).max(50),
	middleName: z.string().min(2).max(50).optional().nullable(),
	birthday: z
		.string()
		.datetime()
		.transform(str => new Date(str)),
	email: z.string().email(),
	password: z.string().min(8)
})

export const userLoginDto = z.object({
	email: z.string().email('Не корректный email'),
	password: z.string().min(8, 'Слишком короткий пароль!')
})

export type TUserCreateDto = z.infer<typeof userCreateDto>
export type TUserLoginDto = z.infer<typeof userLoginDto>
