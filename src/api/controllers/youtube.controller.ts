import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { GetYoutubeTimestampDetailRequest, GetYoutubeTimestampDetailResponse, PostYoutubeCheckUrlRequest, PostYoutubeCheckUrlResponse,
	PostYoutubeTimestampGenerateRequest, PostYoutubeTimestampGenerateResponse,
	PutYoutubeUpdateTimestampStatusRequest } from '../dtos/youtube.dto'
import { YoutubeService } from '../services/youtube.service'
import { UserModel } from '../dtos/models/user.model'

@Controller('youtubes')
@ApiTags('Youtube')
@UseGuards(JwtAuthGuard)
export class YoutubeController {

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
	@CommonResponse({ type: PostYoutubeCheckUrlResponse })
	async checkYoutubeURL(@Body() body: PostYoutubeCheckUrlRequest, @CurrentUser() user: UserModel) {
		const youtubeId = await this.youtubeService.checkUsableYoutube(body.url, user.id)
		return PostYoutubeCheckUrlResponse.builder()
			.youtubeId(youtubeId)
			.build()
	}

	// TODO: youtube timestamp 생성
	@Post('timestamp-generate')
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
	@Put(':id(\\d+)/timestamp-status')
	@CommonResponse({ type: Boolean })
	async updateYoutubeTimestampStatus(@Param('id') id: number, @Body() body: PutYoutubeUpdateTimestampStatusRequest) {
		await this.youtubeService.modifyYoutubeTimestampStatus(id, body.youtubeTimestampId, body.status)
		return true
	}

	// TODO: youtube 처리 결과 상세 정보
	@Get(':id(\\d+)/timestamp')
	@CommonResponse({ type: GetYoutubeTimestampDetailResponse })
	async getYoutubeTimestampDetail(@Param('id') id: number, @Query() query: GetYoutubeTimestampDetailRequest) {
		console.log(id)
		console.log(query)
	}

}
