import { Body, Controller, Get, Inject, Post } from '@nestjs/common'
import { ApiBody, ApiExcludeController, ApiProperty } from '@nestjs/swagger'
import dayjs from 'dayjs'
import { YoutubeService } from '../services/youtube.service'
import { plainToInstance } from 'class-transformer'
import { YoutubeCaptionModel } from '../dtos/models/youtube.model'

class YoutubeTestRequest {
	@ApiProperty()
	url: string
}
@Controller()
// @ApiExcludeController()
export class AppController {

	@Inject()
	private readonly youtubeService: YoutubeService

	@Get('time')
	async time() {
		dayjs().locale('ko')
		return {
			date: dayjs().format('YYYY-MM-DD'),
			dayOfWeek: dayjs().format('dddd').slice(0, 1),
			hour: dayjs().format('k'),
		}
	}

	@Get('health')
	healthCheck(): boolean {
		return true
	}

	@Post('youtube-test')
	async youtubeTest(@Body() body: YoutubeTestRequest) {
		const videoId = this.youtubeService.getVideoIdFromUrl(body.url)
		if (videoId) {
			const captions = await this.youtubeService.getCaption(videoId)
			if (captions) {
				const captionModels = plainToInstance(YoutubeCaptionModel, captions)
				const result = await this.youtubeService.invokeYoutubeTimestampByCaptionsLambda(captionModels)
				return result
			}

		}
		return null

	}

}
