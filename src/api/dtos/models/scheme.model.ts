import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export enum SchemeType {
	YOUTUBE_CHANNEL = 'YOUTUBE_CHANNEL',
	YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
	INSTAGRAM_PROFILE = 'INSTAGRAM_PROFILE',
	INSTAGRAM_POST = 'INSTAGRAM_POST',
}

export class SchemeModel {

	@Expose()
	@ApiProperty()
	id: number

	@Expose()
	@ApiProperty({ enum: SchemeType })
	type: SchemeType

	@Expose()
	@ApiProperty({ type: String, nullable: false, description: '이동할 web url' })
	url: string

	@Expose()
	@ApiProperty({ type: String, nullable: false, description: '유저가 사용할 custom url' })
	customUrl: string

	@Expose()
	@ApiProperty({ description: 'custom url 뒤에 붙을 입력받은 path' })
	path: string
}
