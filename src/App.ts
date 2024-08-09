import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dayjs from 'dayjs'
import koLocale from 'dayjs/locale/ko'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import minmax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import express from 'express'
import { join } from 'path'
import 'reflect-metadata'
import { AppModule } from 'src/app.module'
import { ErrorResponse } from 'src/common/response'
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional'
import { ApiModule } from './api/api.module'
process.env.UV_THREADPOOL_SIZE = '64'

export const initApp = async () => {
	initializeTransactionalContext({ storageDriver: StorageDriver.AUTO })

	const app = express()
	app.use(express.static(join(__dirname, '..', 'public')))
	app.use(express.json())
	app.use(express.urlencoded({ extended: true, limit: '30mb' }))
	app.disable('x-powered-by')
	const corsOptions = { origin: [
		'https://localhost:3000', 'http://localhost:3000', 'http://localhost:8000',
		'https://mug-space.io', 'https://www.mug-space.io', 'https://mug-space.vercel.app',
		'https://bursting-currently-akita.ngrok-free.app',
	], credentials: true }
	app.use(cors(corsOptions))
	const nestapp = await NestFactory.create(AppModule, new ExpressAdapter(app))
	nestapp.enableShutdownHooks()
	nestapp.enableCors(corsOptions)
	nestapp.use(compression())
	nestapp.use(cookieParser())
	nestapp.useGlobalPipes(new ValidationPipe({
		transform: true,
		disableErrorMessages: process.env.NODE_ENV === 'production',
	}))
	const swaggerDocument = initSwagger(nestapp)
	SwaggerModule.setup('/api', nestapp, swaggerDocument)
	initDayjs()
	await nestapp.init()
	return app
}

export function initSwagger(nest: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('MugSpace API')
		.setDescription('## MugSpace API')
		.addCookieAuth('auth')
		.build()

	const options: SwaggerDocumentOptions = {
		include: [ ApiModule ],
		extraModels: [ ErrorResponse ],
		operationIdFactory: (_, method) => method,
	}
	const document = SwaggerModule.createDocument(nest, config, options)
	return document
}

function initDayjs() {
	dayjs.extend(customParseFormat)
	dayjs.extend(isSameOrAfter)
	dayjs.extend(isSameOrBefore)
	dayjs.extend(minmax)
	dayjs.extend(utc)
	dayjs.extend(timezone)
	dayjs.extend(relativeTime)
	dayjs.locale({
		...koLocale,
		weekStart: 1,
	})
}
