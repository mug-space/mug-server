import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined, IsPhoneNumber } from 'class-validator'
import { UserModel } from './models/user.model'

export class GetUserMeResponse extends UserModel {
	static readonly builder = () => Builder(this)
}

export class PostUserMeRequest {
	@ApiProperty({ type: String, nullable: true })
	nickName: string | null

	@ApiProperty({ type: String, nullable: true })
	phone: string | null

	@ApiProperty({ type: String, nullable: true })
	email: string | null
}
export class PutUserInfoRequest {
	@ApiProperty()
	@IsDefined()
	name: string

	@ApiProperty()
	@IsDefined()
	phoneNumber: string
}

export class PutUserAddressRequest {
	@ApiProperty()
	@IsDefined()
	address: string
}


export class PostUserDeliveryRequest {
	@ApiProperty({ type: String, nullable: true })
	@IsDefined()
	name: string

	@ApiProperty({ type: String, nullable: true })
	@IsDefined()
	address1: string

	@ApiProperty({ type: String, nullable: true })
	address2: string

	@ApiProperty({ type: String, nullable: true })
	@IsDefined()
	@IsPhoneNumber('KR', { message: '전화번호를 입력해주세요.' })
	phone: string

	@ApiProperty({ type: String, nullable: true })
	message: string

	@ApiProperty({ type: String, nullable: true })
	bcode: string

	@ApiProperty({ type: String, nullable: true })
	zonecode: string

}

export class PostUserDeliveryResponse {
}

export class GetUserDeliveryResponse {

	static readonly builder = () => Builder(this)
	@ApiProperty({ type: String, nullable: true })
	name: string

	@ApiProperty({ type: String, nullable: true })
	address1: string

	@ApiProperty({ type: String, nullable: true })
	address2: string

	@ApiProperty({ type: String, nullable: true })
	phone: string

	@ApiProperty({ type: String, nullable: true })
	message: string | null

	@ApiProperty({ type: String, nullable: true })
	bcode: string | null

	@ApiProperty({ type: String, nullable: true })
	zonecode: string | null

}