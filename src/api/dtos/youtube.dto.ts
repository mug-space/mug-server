import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined, IsEnum } from 'class-validator'
import { YoutubeTimestampStatus } from '../entities/youtube-timestamp.entity'
import { YoutubeCaptionModel, YoutubeModel, YoutubeSimpleModel } from './models/youtube.model'

export class GetYoutubeCaptionListResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: YoutubeCaptionModel, isArray: true })
	captions: YoutubeCaptionModel[]
}

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

export class GetYoutubeListResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: YoutubeSimpleModel, isArray: true })
	youtubes: YoutubeSimpleModel[]
}

export class GetYoutubeDetailResponse {
	static readonly builder = () => Builder(this)
	@ApiProperty({ type: YoutubeModel })
	youtube: YoutubeModel

}
