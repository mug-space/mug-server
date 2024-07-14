import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { PaymentEntity } from '../entities/payment.entity'

@CustomRepository(PaymentEntity)
export class PaymentRepository extends Repository<PaymentEntity> {
}
