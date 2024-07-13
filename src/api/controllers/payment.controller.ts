import { HttpService } from '@nestjs/axios'
import { Body, Controller, Get, Inject, NotFoundException, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'

const secretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'

@Controller('payments')
@ApiTags('Billing')
export class PaymentController {

	@Inject()
	private readonly httpService: HttpService

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
		const encryptedSecretKey =
    'Basic ' + Buffer.from(secretKey + ':').toString('base64')
		const response = await this.httpService.post('https://api.tosspayments.com/v1/payments/confirm',
			JSON.stringify({ orderId, amount, paymentKey }),
			{ headers: {
				Authorization: encryptedSecretKey,
				'Content-Type': 'application/json',
			} }
		).toPromise()
		if (response) {
			return response.data
		}
		return null
	}

}
