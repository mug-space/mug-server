import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined, IsEnum } from 'class-validator'
import { YoutubeTimestampStatus } from '../entities/youtube-timestamp.entity'

export class PostYoutubeCheckUrlRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	url: string
}

export class PostYoutubeCheckUrlResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: String, nullable: true })
	youtubeId: number | null

}

export class PostYoutubeTimestampGenerateRequest {
	@ApiProperty()
	@IsDefined()
	youtubeId: number
}

export class PostYoutubeTimestampGenerateResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: Boolean })
	result: boolean

}

export class PutYoutubeUpdateTimestampStatusRequest {
	@ApiProperty()
	@IsDefined()
	youtubeTimestampId: number

	@ApiProperty({ enum: YoutubeTimestampStatus })
	@IsDefined()
	@IsEnum(YoutubeTimestampStatus)
	status: YoutubeTimestampStatus
}

export class GetYoutubeTimestampDetailRequest {
	@ApiProperty()
	@IsDefined()
	youtubeTimestampId: number
}

export class GetYoutubeTimestampDetailResponse {

}
