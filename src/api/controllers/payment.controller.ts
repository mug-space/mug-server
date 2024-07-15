import { HttpService } from '@nestjs/axios'
import { Body, Controller, Get, Inject, NotFoundException, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'
import { PaymentService } from '../services/payment.service'

@Controller('payments')
@ApiTags('Billing')
@UseGuards(JwtAuthGuard)
export class PaymentController {

	@Inject()
	private readonly paymentService: PaymentService

	// TODO: 결제 목록
	async getPaymentList() {

	}

	// TODO: 결제 승인
	@Post('confirm')
	async confirmPayment(@CurrentUser() user: UserModel | null, @Body() body: { paymentKey: string, orderId: string, amount: number }) {
		if (!user) {
			throw new UnauthorizedException('Required Login')
		}
		const { paymentKey, orderId, amount } = body
		const payment = await this.paymentService.confirmPayment(orderId, paymentKey, amount)
		if (payment) {
			// db payment insert
		}
	}

}
