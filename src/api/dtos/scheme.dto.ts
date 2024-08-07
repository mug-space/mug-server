import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined, IsEnum } from 'class-validator'
import { SchemeExpireType, SchemeModel, SchemePoint, SchemeType } from './models/scheme.model'

export class PostSchemeAddRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	url: string

	@ApiProperty({ enum: SchemeType })
	@IsEnum(SchemeType)
	type: SchemeType

	@ApiProperty()
	@IsDefined()
	path: string

	@ApiProperty({ enum: SchemeExpireType })
	@IsEnum(SchemeExpireType)
	expireType: SchemeExpireType
}

export class PostSchemeAddResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel })
	scheme: SchemeModel
}

export class PutSchemeModifyRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	url: string
}

export class PutSchemeModifyResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel })
	scheme: SchemeModel
}

export class PutSchemeExpiredAtModifyRequest {
	@ApiProperty({ enum: SchemeExpireType })
	@IsDefined()
	@IsEnum(SchemeExpireType)
	expireType: SchemeExpireType
}

export class PutSchemeExpiredAtModifyResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel })
	scheme: SchemeModel
}

export class GetSchemeListResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel, isArray: true })
	schemes: SchemeModel[]
}

export class GetSchemePointListResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemePoint, isArray: true })
	schemePoints: SchemePoint[]
}

export class GetSchemeDetailResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel })
	scheme: SchemeModel
}
