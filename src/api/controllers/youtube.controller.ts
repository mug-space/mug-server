import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { GetYoutubeCaptionListResponse, GetYoutubeDetailResponse, GetYoutubeListResponse,
	PostYoutubeCheckUrlRequest, PostYoutubeCheckUrlResponse,
	PostYoutubeTimestampGenerateRequest, PostYoutubeTimestampGenerateResponse,
	PutYoutubeUpdateTimestampListRequest,
	PutYoutubeUpdateTimestampStatusRequest } from '../dtos/youtube.dto'
import { YoutubeService } from '../services/youtube.service'
import { UserModel } from '../dtos/models/user.model'

@Controller('youtubes')
@ApiTags('Youtube')
export class YoutubeController {

	@Inject()
	private readonly youtubeService: YoutubeService

	@Get()
	@ApiOperation({ summary: '처리한 youtube list' })
	@CommonResponse({ type: GetYoutubeListResponse })
	@UseGuards(JwtAuthGuard)
	async getYoutubeTimestampList(@CurrentUser() user: UserModel | null) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const youtubeList = await this.youtubeService.getYoutubeSimpleList(user.id)
		return GetYoutubeListResponse.builder()
			.youtubes(youtubeList)
			.build()
	}

	@Get(':id(\\d+)/captions')
	@ApiOperation({ summary: 'youtube info 의 자막정보 (for lambda)' })
	@CommonResponse({ type: GetYoutubeCaptionListResponse })
	async getYoutubeCaptionList(@Param('id') id: number) {
		const captions = await this.youtubeService.getYoutubeCaptionList(id)
		if (!captions) {
			throw new NotFoundException('not found youtube info')
		}
		return GetYoutubeCaptionListResponse.builder()
			.captions(captions)
			.build()

	}

	@Post('check')
	@ApiOperation({ summary: 'youtube url 을 입력받아서 처리 가능한 url일경우 youtube db 생성 후 youtube db Id return' })
	@CommonResponse({ type: PostYoutubeCheckUrlResponse })
	@UseGuards(JwtAuthGuard)
	async checkYoutubeURL(@Body() body: PostYoutubeCheckUrlRequest, @CurrentUser() user: UserModel | null) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const youtubeId = await this.youtubeService.checkUsableYoutube(body.url, user.id)
		return PostYoutubeCheckUrlResponse.builder()
			.youtubeId(youtubeId)
			.build()
	}

	@Post('timestamp-generate')
	@ApiOperation({ summary: 'youtube timestamp 생성' })
	@CommonResponse({ type: PostYoutubeTimestampGenerateResponse })
	@UseGuards(JwtAuthGuard)
	async generateYoutubeTimestamp(@Body() body: PostYoutubeTimestampGenerateRequest) {
		const existTimestamp = await this.youtubeService.existYoutubeTimestamp(body.youtubeId)
		if (existTimestamp) {
			throw new BadRequestException('already generate timestamp')
		}
		await this.youtubeService.addYoutubeTimestamp(body.youtubeId)
		await this.youtubeService.invokeYoutubeTimestampLambda(body.youtubeId)
		return PostYoutubeTimestampGenerateResponse.builder()
			.result(true)
			.build()

	}

	@Put(':id(\\d+)/timestamp-status')
	@ApiOperation({ summary: 'youtube timestamp status update (for lambda)' })
	@CommonResponse({ type: Boolean })
	async updateYoutubeTimestampStatus(@Param('id') id: number, @Body() body: PutYoutubeUpdateTimestampStatusRequest) {
		await this.youtubeService.modifyYoutubeTimestampStatus(id, body.status)
		return true
	}

	@Put(':id(\\d+)/timestamps')
	@ApiOperation({ summary: 'youtube timestamps update (for lambda)' })
	@CommonResponse({ type: Boolean })
	async updateYoutubeTimestamps(@Param('id') id: number, @Body() body: PutYoutubeUpdateTimestampListRequest) {
		await this.youtubeService.modifyYoutubeTimestampList(id, body.timestamps)
		return true
	}

	@Get(':id(\\d+)')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'youtube 처리 결과 상세 정보' })
	@CommonResponse({ type: GetYoutubeDetailResponse })
	async getYoutubeDetail(@CurrentUser() user: UserModel | null, @Param('id') id: number) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const youtube = await this.youtubeService.getYoutubeDetail(user.id, id)
		if (!youtube) {
			throw new NotFoundException('not found youtube')
		}
		return GetYoutubeDetailResponse.builder()
			.youtube(youtube)
			.build()
	}

}
