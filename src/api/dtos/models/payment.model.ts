import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { PaymentMethod, PaymentStatus } from 'src/api/entities/payment.entity'

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
	@ApiProperty()
	createdAt: number

	@Expose()
	@ApiProperty()
	updatedAt: number
}
