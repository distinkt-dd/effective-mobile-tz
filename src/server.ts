import express, { NextFunction, Request, Response } from 'express'

import { userRouter } from './models/user/user.routes'
import prisma from './prisma'

const { PORT = 3000 } = process.env

const app = express()

app.use(express.json())
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log('Body:', req.body)
	console.log('Headers:', req.headers['content-type'])
	next()
})
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'effective-mobile',
	})
})

app.use('/api/user', userRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack)
	res.status(500).json({
		message: 'Что то пошло не так!',
		error: err.message,
	})
})

async function server() {
	await prisma.$connect()
	console.log('База данных активна!')
	app.listen(PORT)
	console.log(`Сервер запущен на http://localhost:${PORT}`)
}

server().catch(err => {
	console.log('Ошибка запуска сервера: ', err)
	prisma.$disconnect()
	process.exit(1)
})
