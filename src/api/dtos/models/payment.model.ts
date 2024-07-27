import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { PaymentMethod, PaymentStatus } from 'src/api/entities/payment.entity'
import { EasyPayType } from './toss-payment.dto'

class Receipt {
	@ApiProperty()
	@Expose()
	url: string
}

class EasyPay {
	@ApiProperty({ enum: EasyPayType })
	@Expose()
	provider: EasyPayType

	@ApiProperty()
	@Expose()
	amount: number

	@ApiProperty()
	@Expose()
	discountAmount: number
}

export class PaymentModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty({ enum: PaymentStatus })
	status: PaymentStatus

	@Expose()
	@ApiProperty({ enum: PaymentMethod })
	method: PaymentMethod

	@Expose()
	@ApiProperty()
	orderId: string

	@Expose()
	@ApiProperty()
	orderName: string

	@Expose()
	@ApiProperty()
	totalAmount: number

	@Expose()
	@ApiProperty({ type: Receipt, nullable: true })
	receipt: Receipt | null

	@Expose()
	@ApiProperty({ type: EasyPay, nullable: true })
	easyPay?: EasyPay | null

	@Expose()
	@ApiProperty()
	createdAt: number

	@Expose()
	@ApiProperty()
	updatedAt: number
}
