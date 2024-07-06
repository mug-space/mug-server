import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class UserModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty({ type: String, nullable: true })
	snsUid: string | null

	@Expose()
	@ApiProperty({ type: String, nullable: true })
	nickName: string | null

	@Expose()
	@ApiProperty({ type: String, nullable: true })
	phone: string | null

	@Expose()
	@ApiProperty({ type: String, nullable: true })
	email: string | null

	@Expose()
	@ApiProperty({ type: String, nullable: true })
	role: string | null

}
