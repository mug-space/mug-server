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

	async getPointByOrderId(orderid: string) {
		const productId = this.extractProductId(orderid)
		if (productId) {
			const product = await this.productRepository.findOne({ where: { id: productId } })
			if (product) {
				return product.point
			}
		}
		return null
	}

	extractProductId(orderId: string): number | null {
		const parts = orderId.split('-')
		if (parts.length === 3 && parts[0] === 'MUG') {
			const productId = parseInt(parts[1], 10)
			if (!isNaN(productId)) {
				return productId
			}
		}
		return null
	}

	async generateOrderId(productId: number) {
		const product = await this.productRepository.findOne({ where: {
			id: productId, enabled: true,
		} })
		if (product) {
			const milliseconds = new Date().valueOf()
			return `MUG-${productId}-${milliseconds}`
		}
		return null

	}
}
