import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsEmail } from 'class-validator'
import { UserModel } from './models/user.model'

export class GetUserMeResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: UserModel })
	user: UserModel
}

export class PostUserSignUpRequest {
	@ApiProperty({ type: String, nullable: true })
	account: string

	@ApiProperty({ type: String, nullable: true })
	@IsEmail()
	email: string

	@ApiProperty({ type: String, nullable: true })
	password: string
}

export class PostUserSignInRequest {
	@ApiProperty({ type: String, nullable: true })
	account: string

	@ApiProperty({ type: String, nullable: true })
	password: string
}
