import { Controller, Get, Inject, NotFoundException, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CommonResponse } from 'src/common/response'
import { GetProductListResponse, GetProductOrderIdRequest, GetProductOrderIdResponse } from '../dtos/product.dto'
import { ProductService } from '../services/product.service'

@Controller('products')
@ApiTags('Product')
export class ProductController {

	@Inject()
	private readonly productService: ProductService

	@Get()
	@ApiOperation({ summary: '결제(포인트충전) 상품 목록' })
	@CommonResponse({ type: GetProductListResponse })
	async getProductList() {
		const products = await this.productService.getProductList()
		return GetProductListResponse.builder()
			.products(products)
			.build()
	}

	@Get('order-id')
	@ApiOperation({ summary: 'product id 로 order id 생성' })
	@CommonResponse({ type: GetProductOrderIdResponse })
	async getOrderId(@Query() query: GetProductOrderIdRequest) {
		const orderId = await this.productService.generateOrderId(query.productId)
		if (!orderId) {
			throw new NotFoundException('not found product')
		}
		return GetProductOrderIdResponse.builder()
			.orderId(orderId)
			.build()
	}
}
