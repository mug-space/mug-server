import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined, IsEmail } from 'class-validator'
import { UserModel } from './models/user.model'

export class GetUserMeResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: UserModel })
	user: UserModel
}

export class PostUserSignUpRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	account: string

	@ApiProperty({ type: String, nullable: false })
	@IsEmail()
	@IsDefined()
	email: string

	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	password: string
}

export class PostUserSignInRequest {
	@IsDefined()
	@ApiProperty({ type: String, nullable: false })
	account: string

	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	password: string
}
