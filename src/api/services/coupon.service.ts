import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CouponRepository } from '../repositories/coupon.repository'
import { UserRepository } from '../repositories/user.repository'
import { PointLogRepository } from '../repositories/point-log.repository'
import { PointLogType } from '../entities/point-log.entity'
import { Transactional } from 'typeorm-transactional'

@Injectable()
export class CouponService {

	@InjectRepository(CouponRepository)
	private readonly couponRepository: CouponRepository
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository
	@InjectRepository(PointLogRepository)
	private readonly pointLogRepository: PointLogRepository

	@Transactional()
	async applyCoupon(couponUuid: string, userId: number) {
		const coupon = await this.couponRepository.findOne({ where: {
			uuid: couponUuid,
			isUse: false,
		} })
		if (coupon) {
			const result = await this.userRepository.incrementPoint(userId, 400)
			await this.pointLogRepository.savePointLog(userId, 400, PointLogType.충전)
			if (result) {
				coupon.isUse = true
				await this.couponRepository.save(coupon)
				return true
			}
		}
		return false
	}
}
