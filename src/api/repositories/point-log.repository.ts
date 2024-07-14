import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { PointLogEntity } from '../entities/point-log.entity'

@CustomRepository(PointLogEntity)
export class PointLogRepository extends Repository<PointLogEntity> {
}
