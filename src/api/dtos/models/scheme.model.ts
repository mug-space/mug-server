import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export enum SchemeType {
	YOUTUBE_CHANNEL = 'YOUTUBE_CHANNEL',
	YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
}

export class SchemeModel {

	@Expose()
	@ApiProperty()
	id: number

	@Expose()
	@ApiProperty({ enum: SchemeType })
	type: SchemeType

	@Expose()
	@ApiProperty({ type: String, nullable: false })
	url: string

	@Expose()
	@ApiProperty({ type: Number, nullable: false })
	ios: string

	@Expose()
	@ApiProperty({ type: String, nullable: false })
	android: string
}
