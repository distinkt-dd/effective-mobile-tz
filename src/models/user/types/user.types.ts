import { Request } from 'express'
import {
	EnumUserRoles,
	EnumUserStatus,
} from '../../../../generated/prisma/enums'

export type TUser = {
	id: string
	firstName: string
	lastName: string
	middleName?: string | null
	birthday: Date
	email: string
	password: string
	role: EnumUserRoles
	status: EnumUserStatus
}

export type TRegisterUser = Pick<
	TUser,
	| 'firstName'
	| 'lastName'
	| 'middleName'
	| 'birthday'
	| 'email'
	| 'password'
	| 'role'
	| 'status'
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
