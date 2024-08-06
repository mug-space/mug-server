import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Post,
	UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'
import { PaymentService } from '../services/payment.service'
import { GetPaymentListResponse, PostPaymentConfirmRequest, PostPaymentConfirmResponse } from '../dtos/payment.dto'
import { PointService } from '../services/point.service'
import { ProductService } from '../services/product.service'
import { UserService } from '../services/user.service'
import { TossPayment } from '../dtos/models/toss-payment.dto'
import { PointLogType } from '../entities/point-log.entity'
import { PaymentStatus } from '../entities/payment.entity'

@Controller('payments')
@ApiTags('Payment')
export class PaymentController {

	@Inject()
	private readonly paymentService: PaymentService
	@Inject()
	private readonly pointService: PointService
	@Inject()
	private readonly productService: ProductService
	@Inject()
	private readonly userService: UserService

	@Get()
	@ApiOperation({ summary: '결제 이력' })
	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '결제 처리후 전달받은 paymentKey와 함께 최종승인 호출' })
	@CommonResponse({ type: PostPaymentConfirmResponse })
	async confirmPayment(@CurrentUser() user: UserModel | null, @Body() body: PostPaymentConfirmRequest) {
		if (!user) {
			throw new UnauthorizedException('required login')
		}
		const { paymentKey, orderId, amount } = body
		const point = await this.productService.getPointByOrderId(orderId)
		if (!point) {
			throw new BadRequestException('not found orderId')
		}
		const payment = await this.paymentService.confirmPayment(orderId, paymentKey, amount)
		if (!payment) {
			throw new BadRequestException('결제실패')
		}
		await this.paymentService.addPayment(payment, user.id)
		await this.pointService.incrementPoint(user.id, point)
		const updatedUser = await this.userService.getUserById(user.id)
		if (!updatedUser) {
			throw new NotFoundException('not found user')
		}

		return PostPaymentConfirmResponse.builder()
			.point(updatedUser.point)
			.build()
	}

	@Post('callback')
	@ApiExcludeEndpoint()
	async paymentStatusChangeCallback(@Body() body: { eventType: string, createdAt: string, data: TossPayment }) {
		try {
			console.log(body)
			const payment = await this.paymentService.getPaymentByPaymentKey(body.data.paymentKey)
			if (payment) {
				if (body.data.status === PaymentStatus.CANCELED) {
					const point = await this.productService.getPointByOrderId(payment.orderId)
					if (point) {
						await this.pointService.decrementPoint(payment.userId, point, PointLogType.취소)
					}
				}
				await this.paymentService.updatePayment(body.data, body.data.paymentKey)
			}
			return true
		} catch (error) {
			throw error
		}

	}

}
