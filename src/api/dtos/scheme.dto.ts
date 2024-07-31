import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined, IsEnum } from 'class-validator'
import { SchemeModel, SchemeType } from './models/scheme.model'

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

export class GetSchemeListResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel, isArray: true })
	schemes: SchemeModel[]
}

export class GetSchemeDetailResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: SchemeModel })
	scheme: SchemeModel
}
