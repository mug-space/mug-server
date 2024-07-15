import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { ProductEntity } from '../entities/product.entity'

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
}
