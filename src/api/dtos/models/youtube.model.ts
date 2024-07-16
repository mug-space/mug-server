import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { YoutubeTimestampStatus } from 'src/api/entities/youtube-timestamp.entity'

export class YoutubeTimestampModel {
	@Expose()
	@ApiProperty()
	time: string

	@Expose()
	@ApiProperty()
	title: string
}

export class YoutubeCaptionModel {
	@Expose()
	@ApiProperty()
	text: string

	@Expose()
	@ApiProperty()
	duration: number

	@Expose()
	@ApiProperty()
	offset: number

	@Expose()
	@ApiProperty()
	lang: string
}

export class YoutubeSimpleModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty()
	videoId: string

	@Expose()
	@ApiProperty({ enum: YoutubeTimestampStatus })
	status: YoutubeTimestampStatus

	@Expose()
	@ApiProperty()
	createdAt: number

}

export class YoutubeModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty()
	videoId: string

	@Expose()
	@ApiProperty({ enum: YoutubeTimestampStatus })
	status: YoutubeTimestampStatus

	@Expose()
	@ApiProperty()
	timestampString: string

	@Expose()
	@ApiProperty()
	createdAt: number
}
