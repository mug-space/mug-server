import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { PointLogEntity, PointLogType } from '../entities/point-log.entity'

@CustomRepository(PointLogEntity)
export class PointLogRepository extends Repository<PointLogEntity> {

	async savePointLog(userId: number, point: number, type: PointLogType) {
		const pointLog = this.create({ userId, point, type })
		return await this.save(pointLog)
	}
}
