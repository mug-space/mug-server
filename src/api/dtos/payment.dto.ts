import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined } from 'class-validator'
import { PaymentModel } from './models/payment.model'

export class PostPaymentConfirmRequest {
	@ApiProperty()
	@IsDefined()
	paymentKey: string

	@ApiProperty()
	@IsDefined()
	orderId: string

	@ApiProperty()
	@IsDefined()
	amount: number
}

export class GetPaymentListResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: PaymentModel, isArray: true })
	payments: PaymentModel[]
}
