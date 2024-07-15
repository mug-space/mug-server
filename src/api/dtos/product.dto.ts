import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined } from 'class-validator'
import { ProductModel } from './models/product.model'

export class GetProductListResponse {

	static readonly builder = () => Builder(this)
	@ApiProperty({ type: ProductModel, isArray: true })
	products: ProductModel[]
}

export class GetProductOrderIdRequest {
	@ApiProperty()
	@IsDefined()
	productId: number
}

export class GetProductOrderIdResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty()
	orderId: string
}
