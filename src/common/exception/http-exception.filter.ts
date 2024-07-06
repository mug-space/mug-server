import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { ErrorResponse } from '../response/base_response.model'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name)
	public async catch(exception: Error, host: ArgumentsHost) {
		console.error(exception)
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		// const { httpAdapter } = this.httpAdapterHost
		const ctx = host.switchToHttp()
		// ctx.getResponse().status(500).json({
		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR
		const errorResponse: ErrorResponse = new ErrorResponse(ctx.getRequest().url, ctx.getRequest().method)
		errorResponse.message = exception.message
		errorResponse.error = exception.constructor.name
		this.logger.error(exception)
		this.logger.error(errorResponse)
		console.log((exception as any).response?.data)
		ctx.getResponse().status(httpStatus).json(errorResponse)
		// httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus)
	}
}
