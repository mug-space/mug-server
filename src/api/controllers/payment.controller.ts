import { Body, Controller, Get, Inject, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'
import { PaymentService } from '../services/payment.service'
import { GetPaymentListResponse, PostPaymentConfirmRequest } from '../dtos/payment.dto'
import { PointService } from '../services/point.service'
import { ProductService } from '../services/product.service'

@Controller('payments')
@ApiTags('Billing')
@UseGuards(JwtAuthGuard)
export class PaymentController {

	@Inject()
	private readonly paymentService: PaymentService
	@Inject()
	private readonly pointService: PointService
	@Inject()
	private readonly productService: ProductService

	@Get()
	@ApiOperation({ summary: '결제 이력' })
	@CommonResponse({ type: GetPaymentListResponse })
	async getPaymentList(@CurrentUser() user: UserModel | null) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const paymentList = await this.paymentService.getPaymentList(user.id)
		return GetPaymentListResponse.builder()
			.payments(paymentList)
			.build()

	}

	@Post('confirm')
	@ApiOperation({ summary: '결제 처리후 전달받은 paymentKey와 함께 최종승인 호출' })
	@CommonResponse({ type: Boolean })
	async confirmPayment(@CurrentUser() user: UserModel | null, @Body() body: PostPaymentConfirmRequest) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const { paymentKey, orderId, amount } = body
		const point = await this.productService.getPointByOrderId(orderId)
		if (point) {
			const payment = await this.paymentService.confirmPayment(orderId, paymentKey, amount)
			if (payment) {
				await this.paymentService.addPayment(payment, user.id)
				await this.pointService.incrementPoint(user.id, point)
				return true
			}
		}

		return false
	}

}
