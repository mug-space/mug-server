import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { SchemeEntity } from '../entities/scheme.entity'

@CustomRepository(SchemeEntity)
export class SchemeRepository extends Repository<SchemeEntity> {
}
