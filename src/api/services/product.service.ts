import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { ProductModel } from '../dtos/models/product.model'
import { ProductRepository } from '../repositories/product.repository'

@Injectable()
export class ProductService {

	@InjectRepository(ProductRepository)
	private readonly productRepository: ProductRepository

	async getProductList() {
		const products = await this.productRepository.find({
			where: { enabled: true },
			order: { amount: 'ASC' },
		})
		return plainToInstance(ProductModel, products, { excludeExtraneousValues: true })
	}
}
