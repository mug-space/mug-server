import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ProductModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty()
	title: string

	@Expose()
	@ApiProperty()
	amount: number

	@Expose()
	@ApiProperty()
	point: number
}
