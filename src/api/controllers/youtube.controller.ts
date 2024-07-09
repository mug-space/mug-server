import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'

@Controller('youtubes')
@ApiTags('Youtube')
export class YoutubeController {

	// TODO: youtube 처리 목록

	// TODO: youtube timestamp 생성

	// TODO: youtube 처리 상세 정보

}
