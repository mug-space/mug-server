import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, Post,
	Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
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
import { PointService } from '../services/point.service'
import { UserService } from '../services/user.service'
import { Propagation, Transactional } from 'typeorm-transactional'
import { YoutubeTimestampStatus } from '../entities/youtube-timestamp.entity'

@Controller('youtubes')
@ApiTags('Youtube')
export class YoutubeController {

	@Inject()
	private readonly youtubeService: YoutubeService
	@Inject()
	private readonly pointService: PointService
	@Inject()
	private readonly userService: UserService

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
		const result = await this.youtubeService.checkUsableYoutube(body.url, user.id)
		return PostYoutubeCheckUrlResponse.builder()
			.youtubeId(result?.youtubeId || null)
			.timestampPoint(result?.point || 0)
			.build()
	}

	@Post('timestamp-generate')
	@ApiOperation({ summary: 'youtube timestamp 생성' })
	@CommonResponse({ type: PostYoutubeTimestampGenerateResponse })
	@UseGuards(JwtAuthGuard)
	@Transactional({ propagation: Propagation.REQUIRED })
	async generateYoutubeTimestamp(@CurrentUser() user: UserModel | null, @Body() body: PostYoutubeTimestampGenerateRequest) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const existTimestamp = await this.youtubeService.existYoutubeTimestamp(body.youtubeId)
		if (existTimestamp) {
			throw new BadRequestException('already generate timestamp')
		}
		const timestampPoint = await this.youtubeService.getYoutubeTimestampPoint(body.youtubeId)
		if (!timestampPoint) {
			throw new NotFoundException('not found youtube info')
		}
		const hasPoint = await this.userService.hasPoint(user.id, timestampPoint)
		if (!hasPoint) {
			throw new BadRequestException('not enough point')
		}
		await this.pointService.decrementPoint(user.id, timestampPoint)
		const firstTimestampId = await this.youtubeService.addYoutubeTimestamp(body.youtubeId)
		const secondTimestampId = await this.youtubeService.addYoutubeTimestamp(body.youtubeId)
		await this.youtubeService.invokeYoutubeTimestampLambda(body.youtubeId, firstTimestampId, 'openai')
		await this.youtubeService.invokeYoutubeTimestampLambda(body.youtubeId, secondTimestampId, 'claude')
		const u = await this.userService.getUserById(user.id)
		if (!u) {
			throw new NotFoundException('not found user')
		}
		return PostYoutubeTimestampGenerateResponse.builder()
			.result(true)
			.point(u.point)
			.build()

	}

	@Put(':id(\\d+)/timestamp-status')
	@ApiOperation({ summary: 'youtube timestamp status update (for lambda)' })
	@CommonResponse({ type: Boolean })
	async updateYoutubeTimestampStatus(@Param('id') id: number, @Body() body: PutYoutubeUpdateTimestampStatusRequest) {
		const timestamp = await this.youtubeService.modifyYoutubeTimestampStatus(id, body.youtubeTimestampId, body.status)
		if (timestamp && timestamp.youtube.youtubeInfo && body.status === YoutubeTimestampStatus.ERROR) {
			const youtube = await this.youtubeService.getYoutube(id)
			if (youtube) {
				await this.pointService.incrementPoint(youtube.userId, timestamp.youtube.youtubeInfo.timestampPoint, true)
			}

		}
		return true
	}

	@Put(':id(\\d+)/timestamps')
	@ApiOperation({ summary: 'youtube timestamps update (for lambda)' })
	@CommonResponse({ type: Boolean })
	async updateYoutubeTimestamps(@Param('id') id: number, @Body() body: PutYoutubeUpdateTimestampListRequest) {
		await this.youtubeService.modifyYoutubeTimestampList(id, body.youtubeTimestampId, body.timestamps)
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
