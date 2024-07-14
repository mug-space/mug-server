import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { CouponEntity } from '../entities/coupon.entity'

@CustomRepository(CouponEntity)
export class CouponRepository extends Repository<CouponEntity> {
}
