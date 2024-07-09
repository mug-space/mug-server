import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'

@Controller('billings')
@ApiTags('Billing')
export class BillingController {

	// TODO: 결제 목록

	// TODO: 결제 금액 Init

	// TODO: 결제 Callback

	// TODO: 결제 취소 요청

}