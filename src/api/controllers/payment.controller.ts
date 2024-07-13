import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'

@Controller('payments')
@ApiTags('Billing')
export class PaymentController {

	// TODO: 결제 목록
	async getPaymentList() {

	}

	// TODO: 결제 승인
	async confirmPayment() {

	}

}
