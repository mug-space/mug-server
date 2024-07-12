import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'

@Controller('inquiries')
@ApiTags('Inquiry')
export class InquiryController {

	// TODO: 문의 등록
	async addInquiry() {

	}

	// TODO: 내 문의 목록
	async getInquiryList() {

	}

	// TODO: 문의 상세
	async getInquiryDetail() {

	}

}
