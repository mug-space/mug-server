import { Body, Controller, Get, Inject, NotFoundException, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { GetInquiryDetailResponse, GetInquiryListResponse, PostInquiryAddRequest } from '../dtos/inquiry.dto'
import { InquiryService } from '../services/inquiry.service'

@Controller('inquiries')
@ApiTags('Inquiry')
export class InquiryController {

	@Inject()
	private readonly inquiryService: InquiryService

	// TODO: 문의 등록
	@Post()
	@ApiOperation({ summary: '문의 등록' })
	@CommonResponse({ type: Boolean })
	async addInquiry(@Body() body: PostInquiryAddRequest) {
		await this.inquiryService.addInquiry(1, body.title, body.content)
		return true
	}

	// TODO: 내 문의 목록
	@Get()
	@ApiOperation({ summary: '문의 목록' })
	@CommonResponse({ type: GetInquiryListResponse })
	async getInquiryList() {
		const inquiryList = await this.inquiryService.getInquiryList(1)
		return GetInquiryListResponse.builder()
			.inquiries(inquiryList)
			.build()
	}

	// TODO: 문의 상세
	@Get(':id(\\d+)')
	@ApiOperation({ summary: '문의 상세' })
	@CommonResponse({ type: GetInquiryDetailResponse })
	async getInquiryDetail(@Param('id') id: number) {
		const inquiry = await this.inquiryService.getInquiry(1, id)
		if (!inquiry) {
			throw new NotFoundException('not found inquiry')
		}
		return GetInquiryDetailResponse.builder()
			.inquiry(inquiry)
			.build()

	}

}
