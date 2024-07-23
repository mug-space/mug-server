import { Body, Controller, Get, Inject, Post } from '@nestjs/common'
import { ApiBody, ApiExcludeController, ApiProperty } from '@nestjs/swagger'
import dayjs from 'dayjs'
import { YoutubeService } from '../services/youtube.service'
import { plainToInstance } from 'class-transformer'
import { YoutubeCaptionModel } from '../dtos/models/youtube.model'
import { EmailParams, MailService } from '../services/mail.service'

class YoutubeTestRequest {
	@ApiProperty()
	url: string
}
@Controller()
// @ApiExcludeController()
export class AppController {

	@Inject()
	private readonly youtubeService: YoutubeService
	@Inject()
	private readonly mailService: MailService

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

				const captionModels = plainToInstance(YoutubeCaptionModel, captions.map((caption) => {
					return {
						text: caption.text,
						duration: Math.floor(caption.duration),
						offset: Math.floor(caption.offset),
					}
				}))
				const result = await this.youtubeService.invokeYoutubeTimestampByCaptionsLambda(captionModels)
				return result
			}

		}
		return null
	}

	@Post('mail-test')
	async mailTest() {
		await this.mailService.sendUserConfirmation('kiseon1987@gmail.com')

	}

}
