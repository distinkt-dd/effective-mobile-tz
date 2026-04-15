import express from 'express'

import prisma from './prisma'

const { PORT = 3000 } = process.env

const app = express()


async function server() {
	await prisma.$connect()
	console.log('Сервер активен!')
	app.listen(PORT)
	console.log(`Сервер запущен на http://localhost:${PORT}`)
}

server().catch(err => {
	console.log('Ошибка запуска сервера: ', err)
	prisma.$disconnect()
	process.exit(1)
})
