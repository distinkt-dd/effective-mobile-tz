import { Request } from 'express'

export type TUser = {
	id: string
	firstName: string
	lastName: string
	middleName?: string
	birthday: Date
	email: string
	password: string
	role: string
	status: string
}

export type TRegisterUser = Pick<
	TUser,
	'firstName' | 'lastName' | 'middleName' | 'birthday' | 'email' | 'password'
>

export type TLoginUser = Pick<TUser, 'email' | 'password'>

type TUserRequest = Pick<
	TUser,
	'id' | 'email' | 'firstName' | 'lastName' | 'role' | 'status'
>

export interface IAuthRequestUser extends Request {
	user?: TUserRequest
}

export type TPartialUser = Partial<TUser>
