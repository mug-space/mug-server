import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'
import { GetSchemeDetailResponse, GetSchemeListResponse, PostSchemeAddRequest,
	PostSchemeAddResponse, PutSchemeModifyRequest, PutSchemeModifyResponse } from '../dtos/scheme.dto'
import { SchemeService } from '../services/scheme.service'

@Controller([ 'schemes', 's' ])
@ApiTags('Scheme')
@UseGuards(JwtAuthGuard)
export class SchemeController {

	@Inject()
	private readonly schemeService: SchemeService

	@Post()
	@ApiOperation({ summary: 'scheme url 생성' })
	@CommonResponse({ type: PostSchemeAddResponse })
	async addSchemeUrl(@Body() body: PostSchemeAddRequest, @CurrentUser() user: UserModel) {
		const scheme = await this.schemeService.addScheme(body.url, body.type, user.id)
		if (!scheme) {
			throw new BadRequestException('잘못된 URL 입니다.')
		}
		return PostSchemeAddResponse.builder()
			.scheme(scheme)
			.build()
	}

	@Put(':id(\\d+)')
	@ApiOperation({ summary: 'scheme url 수정' })
	@CommonResponse({ type: PutSchemeModifyResponse })
	async updateSchemeUrl(@Param('id') id: number, @Body() body: PutSchemeModifyRequest, @CurrentUser() user: UserModel) {
		const scheme = await this.schemeService.updateScheme(id, body.url, user.id)
		if (!scheme) {
			throw new BadRequestException('잘못된 URL 입니다.')
		}
		return PutSchemeModifyResponse.builder()
			.scheme(scheme)
			.build()
	}

	@Get()
	@ApiOperation({ summary: 'scheme url 목록' })
	@CommonResponse({ type: GetSchemeListResponse })
	async getSchemeList(@CurrentUser() user: UserModel) {
		const list = await this.schemeService.getSchemeList(user.id)
		return GetSchemeListResponse.builder()
			.schemes(list)
			.build()
	}

	@Get(':id(\\d+)')
	@ApiOperation({ summary: 'scheme url 상세' })
	@CommonResponse({ type: GetSchemeDetailResponse })
	async getSchemeDetail(@CurrentUser() user: UserModel, @Param('id') id: number) {
		const scheme = await this.schemeService.getSchemeDetail(id, user.id)
		if (!scheme) {
			throw new NotFoundException('존재하지 않습니다.')
		}
		return GetSchemeDetailResponse.builder()
			.scheme(scheme)
			.build()
	}

}
