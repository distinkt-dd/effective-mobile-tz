import express, { NextFunction, Request, Response } from 'express'

import prisma from './prisma'

const { PORT = 3000 } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack)
	res.status(500).json({
		message: 'Что то пошло не так!',
		error: err.message
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
