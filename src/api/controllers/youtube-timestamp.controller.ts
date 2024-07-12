import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'

@Controller('youtube-timestamps')
@ApiTags('YoutubeTimestamp')
export class YoutubeTimestampController {

	// TODO: youtube timestamp 처리 목록
	async getYoutubeTimestampList() {

	}

	// TODO: youtube timestamp 생성
	async generateYoutubeTimestamp() {

	}

	// TODO: youtube 처리 결과 상세 정보
	async getYoutubeTimestampDetail() {

	}

}
