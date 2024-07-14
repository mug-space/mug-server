import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined } from 'class-validator'

export class PostCouponApplyRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	couponUuid: string
}

export class PostCouponApplyResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty()
	result: boolean

}
