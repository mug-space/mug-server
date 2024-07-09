import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'

@Controller('coupons')
@ApiTags('Coupon')
export class CouponController {

	// TODO: coupon 처리

}
