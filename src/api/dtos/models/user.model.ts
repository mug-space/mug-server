import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class UserModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty({ type: String, nullable: false })
	account: string

	@Expose()
	@ApiProperty({ type: String, nullable: false })
	email: string
}
