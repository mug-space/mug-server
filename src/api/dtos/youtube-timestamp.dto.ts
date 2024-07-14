import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined } from 'class-validator'

export class PostYoutubeTimestampCheckUrlRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	url: string
}

export class PostYoutubeTimestampCheckUrlResponse {

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
