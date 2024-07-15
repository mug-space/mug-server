import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { PointLogModel } from '../dtos/models/point-log.model'
import { CouponRepository } from '../repositories/coupon.repository'
import { PointLogRepository } from '../repositories/point-log.repository'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class PointService {

	@InjectRepository(PointLogRepository)
	private readonly pointLogRepository: PointLogRepository

	async getPointLogList(userId: number) {
		const pointLogs = await this.pointLogRepository.find({ where: {
			userId,
		}, order: { id: 'DESC' } })
		return pointLogs.map((pointLog) => plainToInstance(PointLogModel, pointLog, { excludeExtraneousValues: true }))

	}
}
