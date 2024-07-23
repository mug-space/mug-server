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
	firstTimestamps: YoutubeTimestampModel[]

	@Expose()
	@ApiProperty()
	secondTimestamps: YoutubeTimestampModel[]

	@Expose()
	@ApiProperty()
	createdAt: number
}
