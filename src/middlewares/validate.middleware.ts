import { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.body)
			next()
		} catch (err) {
			if (err instanceof ZodError) {
				return res.status(400).json({
					success: false,
					errors: err.issues.map(err => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				})
			}
			next(err)
		}
	}
}
