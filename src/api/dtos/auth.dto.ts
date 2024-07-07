import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsEmail } from 'class-validator'

export class PostAuthSignUpResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty()
	token: string
}

export class PostAuthSignInResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty()
	token: string
}

export class PostAuthSignUpRequest {
	@ApiProperty({ type: String, nullable: true })
	account: string

	@ApiProperty({ type: String, nullable: true })
	@IsEmail()
	email: string

	@ApiProperty({ type: String, nullable: true })
	password: string
}

export class PostAuthSignInRequest {
	@ApiProperty({ type: String, nullable: true })
	account: string

	@ApiProperty({ type: String, nullable: true })
	password: string
}
