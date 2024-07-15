import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { GetProductListResponse } from '../dtos/product.dto'
import { ProductService } from '../services/product.service'

@Controller('products')
@ApiTags('Product')
export class ProductController {

	@Inject()
	private readonly productService: ProductService

	// TODO: 결제 상품 목록
	@Get()
	@ApiOperation({ summary: '결제(포인트충전) 상품 목록' })
	@CommonResponse({ type: GetProductListResponse })
	async getProductList() {
		const products = await this.productService.getProductList()
		return GetProductListResponse.builder()
			.products(products)
			.build()
	}

}
