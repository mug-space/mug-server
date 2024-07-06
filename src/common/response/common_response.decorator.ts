import { SetMetadata } from '@nestjs/common'
import {
	ApiProperty,
	ApiPropertyOptional,
	ApiPropertyOptions,
	ApiResponse,
	ApiResponseMetadata,
} from '@nestjs/swagger'
import { BaseResponse } from './base_response.model'

export const wrapCommonMetadataKey = 'wrapCommonMetadataKey'

/** 공통 Response 로 응답합니다 */
export function CommonResponse({ nullable, ...options }: ApiPropertyOptions & ApiResponseMetadata): MethodDecorator & ClassDecorator {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (target: any, key?: any, descriptor?: any) => {
		class Cls extends BaseResponse {
			@((nullable ? ApiPropertyOptional : ApiProperty)(options))
			public readonly data: unknown
		}

		const apiName = String(key || target.name)
		const modelName = `Api${apiName.charAt(0).toUpperCase()}${apiName.slice(1)}Response`
		Object.defineProperty(Cls, 'name', { value: modelName })
		SetMetadata(wrapCommonMetadataKey, true)(target, key, descriptor)
		ApiResponse({ status: key ? 200 : 'default', ...options, type: Cls })(target, key, descriptor)
	}
}
