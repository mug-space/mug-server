import { Body, Controller, Get, Inject, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { GetInquiryDetailResponse, GetInquiryListResponse, PostInquiryAddRequest } from '../dtos/inquiry.dto'
import { UserModel } from '../dtos/models/user.model'
import { InquiryService } from '../services/inquiry.service'

@Controller('inquiries')
@ApiTags('Inquiry')
@UseGuards(JwtAuthGuard)
export class InquiryController {

	@Inject()
	private readonly inquiryService: InquiryService

	@Post()
	@ApiOperation({ summary: '문의 등록' })
	@CommonResponse({ type: Boolean })
	async addInquiry(@CurrentUser() user: UserModel, @Body() body: PostInquiryAddRequest) {
		await this.inquiryService.addInquiry(user.id, body.title, body.content)
		return true
	}

	@Get()
	@ApiOperation({ summary: '문의 목록' })
	@CommonResponse({ type: GetInquiryListResponse })
	async getInquiryList(@CurrentUser() user: UserModel) {
		const inquiryList = await this.inquiryService.getInquiryList(user.id)
		return GetInquiryListResponse.builder()
			.inquiries(inquiryList)
			.build()
	}

	@Get(':id(\\d+)')
	@ApiOperation({ summary: '문의 상세' })
	@CommonResponse({ type: GetInquiryDetailResponse })
	async getInquiryDetail(@Param('id') id: number, @CurrentUser() user: UserModel) {
		const inquiry = await this.inquiryService.getInquiry(user.id, id)
		if (!inquiry) {
			throw new NotFoundException('not found inquiry')
		}
		return GetInquiryDetailResponse.builder()
			.inquiry(inquiry)
			.build()

	}

}
