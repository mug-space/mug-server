import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class UserModel {

	@Expose()
	@ApiProperty()
	id: number

	@Expose()
	@ApiProperty({ type: String })
	uuid: string

	@Expose()
	@ApiProperty({ type: String, nullable: false })
	account: string

	@Expose()
	@ApiProperty({ type: String, nullable: false })
	email: string

	@Expose()
	@ApiProperty({ type: Number, nullable: false })
	point: number
}
