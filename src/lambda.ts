import { APIGatewayEvent, Context } from 'aws-lambda'
import 'reflect-metadata'
import ServerlessHttp from 'serverless-http'
import { initApp } from './App'

let _handler: ServerlessHttp.Handler
const server = async () => {
	_handler = ServerlessHttp(await initApp(), {})
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
	if (!_handler) await server()
	return _handler(event, context)
}
