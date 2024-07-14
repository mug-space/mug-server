import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { PostYoutubeTimestampCheckUrlRequest, PostYoutubeTimestampCheckUrlResponse,
	PostYoutubeTimestampGenerateRequest, PostYoutubeTimestampGenerateResponse } from '../dtos/youtube-timestamp.dto'
import { YoutubeService } from '../services/youtube.service'
import { UserModel } from '../dtos/models/user.model'

@Controller('youtube-timestamps')
@ApiTags('YoutubeTimestamp')
@UseGuards(JwtAuthGuard)
export class YoutubeTimestampController {

	@Inject()
	private readonly youtubeService: YoutubeService

	// TODO: youtube timestamp 처리 목록
	async getYoutubeTimestampList() {

	}

	// TODO: get youtube captions string
	@Get(':id(\\d+)/captions')
	async getYoutubeCaptionList() {

	}

	@Post('check')
	@ApiOperation({ description: 'youtube url 을 입력받아서 처리 가능한 url일경우 youtube db 생성 후 youtubeId return' })
	@CommonResponse({ type: PostYoutubeTimestampCheckUrlResponse })
	async checkYoutubeURL(@Body() body: PostYoutubeTimestampCheckUrlRequest, @CurrentUser() user: UserModel) {
		const youtubeId = await this.youtubeService.checkUsableYoutube(body.url, user.id)
		return PostYoutubeTimestampCheckUrlResponse.builder()
			.youtubeId(youtubeId)
			.build()
	}

	// TODO: youtube timestamp 생성
	@Post('generate')
	@CommonResponse({ type: PostYoutubeTimestampGenerateResponse })
	async generateYoutubeTimestamp(@Body() body: PostYoutubeTimestampGenerateRequest) {
		// mug-lambda youtube-timestamp-generate lambda-call
		const youtubeTimestampId = await this.youtubeService.addYoutubeTimestamp(body.youtubeId)
		await this.youtubeService.invodeYoutubeTimestampLambda(body.youtubeId, youtubeTimestampId)
		return PostYoutubeTimestampGenerateResponse.builder()
			.result(true)
			.build()

	}

	// TODO: youtube timestamp status update
	@Put(':id(\\d+)')
	async updateYoutubeTimestampStatus(@Param('id') id: number) {

	}

	// TODO: youtube 처리 결과 상세 정보
	@Get(':id(\\d+)')
	async getYoutubeTimestampDetail(@Param('id') id: number) {

	}

}
