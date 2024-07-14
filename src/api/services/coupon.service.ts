import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CouponRepository } from '../repositories/coupon.repository'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class CouponService {

	@InjectRepository(CouponRepository)
	private readonly couponRepository: CouponRepository
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository

	async applyCoupon(couponUuid: string, userId: number) {
		const coupon = await this.couponRepository.findOne({ where: {
			uuid: couponUuid,
			isUse: false,
		} })
		if (coupon) {
			const user = await this.userRepository.findOne({ where: {
				id: userId,
			} })
			if (user) {
				user.point = user.point + 400
				await this.userRepository.save(user)
				coupon.isUse = true
				await this.couponRepository.save(coupon)
				return true
			}
		}
		return false
	}
}
