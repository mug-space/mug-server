import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map } from 'rxjs'

import { BaseResponse } from './base-response.model'
import { wrapCommonMetadataKey } from './common-response.decorator'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	public constructor(
		private reflector: Reflector,
	) { }

	public intercept(context: ExecutionContext, next: CallHandler<unknown>) {
		const wrapCommon = this.reflector.getAllAndOverride(wrapCommonMetadataKey, [ context.getHandler(), context.getClass() ])
		let handle = next.handle()
		if (wrapCommon) {
			handle = handle.pipe(map((data) => new BaseResponse(data)))
		}

		return handle
	}
}
