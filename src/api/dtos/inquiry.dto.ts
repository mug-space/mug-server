import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { IsDefined } from 'class-validator'
import { InquiryModel } from './models/inquiry.model'

export class PostInquiryAddRequest {
	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	title: string

	@ApiProperty({ type: String, nullable: false })
	@IsDefined()
	content: string
}

export class GetInquiryListResponse {

	static readonly builder = () => Builder(this)

	@ApiProperty({ type: InquiryModel, isArray: true })
	inquiries: InquiryModel[]
}

export class GetInquiryDetailResponse {
	static readonly builder = () => Builder(this)

	@ApiProperty({ type: InquiryModel })
	inquiry: InquiryModel
}
