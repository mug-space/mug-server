import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class InquiryModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty()
	title: string

	@Expose()
	@ApiProperty()
	content: string

	@Expose()
	@ApiProperty({ type: String, nullable: true })
	answer: string | null

	@Expose()
	@ApiProperty()
	createdAt: number
}
