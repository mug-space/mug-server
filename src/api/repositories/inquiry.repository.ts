import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { InquiryEntity } from '../entities/inquiry.entity'

@CustomRepository(InquiryEntity)
export class InquiryRepository extends Repository<InquiryEntity> {
}
