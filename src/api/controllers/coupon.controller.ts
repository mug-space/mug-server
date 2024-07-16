import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { PostCouponApplyRequest, PostCouponApplyResponse } from '../dtos/coupon.dto'
import { CouponService } from '../services/coupon.service'
import { UserModel } from '../dtos/models/user.model'

@Controller('coupons')
@ApiTags('Coupon')
@UseGuards(JwtAuthGuard)
export class CouponController {

	@Inject()
	private readonly couponService: CouponService

	@Post('apply')
	@ApiOperation({ summary: 'coupon 적용' })
	@CommonResponse({ type: PostCouponApplyResponse })
	async applyCoupon(@Body() body: PostCouponApplyRequest, @CurrentUser() user: UserModel) {
		const result = await this.couponService.applyCoupon(body.couponUuid, user.id)
		return PostCouponApplyResponse.builder()
			.result(result)
			.build()
	}

}
