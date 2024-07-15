import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { ProductModel } from './models/product.model'

export class GetProductListResponse {

	static readonly builder = () => Builder(this)
	@ApiProperty({ type: ProductModel, isArray: true })
	products: ProductModel[]
}
