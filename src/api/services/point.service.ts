import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { PointLogModel } from '../dtos/models/point-log.model'
import { PointLogRepository } from '../repositories/point-log.repository'
import { UserRepository } from '../repositories/user.repository'
import { PointLogType } from '../entities/point-log.entity'

@Injectable()
export class PointService {

	@InjectRepository(PointLogRepository)
	private readonly pointLogRepository: PointLogRepository
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository

	async getPointLogList(userId: number) {
		const pointLogs = await this.pointLogRepository.find({ where: {
			userId,
		}, order: { id: 'DESC' } })
		return pointLogs.map((pointLog) => plainToInstance(PointLogModel, pointLog, { excludeExtraneousValues: true }))
	}

	async incrementPoint(userId: number, point: number, ignoreLog?: boolean) {
		const result = await this.userRepository.incrementPoint(userId, point)
		if (result && !ignoreLog) {
			await this.pointLogRepository.savePointLog(userId, point, PointLogType.충전)
			return true
		}
		return false
	}

	async decrementPoint(userId: number, point: number) {
		const result = await this.userRepository.decrementPoint(userId, point)
		if (result) {
			await this.pointLogRepository.savePointLog(userId, point, PointLogType.사용)
			return true
		}
		return false
	}
}
