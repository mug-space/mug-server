import { BadRequestException, Body, Controller, Get, Inject, NotFoundException,
	Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { DomainGuard } from 'src/common/auth/domain.guard'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { SchemeType } from '../dtos/models/scheme.model'
import { UserModel } from '../dtos/models/user.model'
import { GetSchemeDetailResponse, GetSchemeListResponse, PostSchemeAddRequest,
	PostSchemeAddResponse, PutSchemeModifyRequest, PutSchemeModifyResponse } from '../dtos/scheme.dto'
import { SchemeService, UserAgentDevice } from '../services/scheme.service'

@Controller([ 'schemes', 's' ])
@ApiTags('Scheme')
export class SchemeController {

	@Inject()
	private readonly schemeService: SchemeService

	@Get('check-device')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async checkDevice(@Req() req: Request) {
		const userAgent = req.headers['user-agent']
		return this.schemeService.detectDevice(userAgent)
	}

	@Get('youtube/c/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectYoutubeChannel(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.YOUTUBE_CHANNEL)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			console.log(userAgent)
			const device = this.schemeService.detectDevice(userAgent)
			console.log(device)
			if (device === UserAgentDevice.Android) {
				redirectUrl = scheme.android
			} else {
				redirectUrl = scheme.ios
			}
			res.send(`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Redirect to YouTube App</title>
					<script>
					function redirectToYouTubeApp() {
						// Custom URL Scheme
						const youtubeAppURL = '${redirectUrl}';

						// Attempt to open the YouTube app
						window.location = youtubeAppURL;

						// Fallback to the YouTube web page after a delay
						setTimeout(function() {
						window.location = "${scheme.url}";
						}, 2000); // 2 seconds delay
					}

					window.onload = redirectToYouTubeApp;
					</script>
				</head>
				<body>
					<p>Redirecting to YouTube...</p>
				</body>
				</html>
				`)
		} else {
			res.redirect('https://mug-space.io')
		}

	}

	@Get('youtube/v/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectYoutubeVideo(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.YOUTUBE_VIDEO)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			console.log(userAgent)
			const device = this.schemeService.detectDevice(userAgent)
			console.log(device)
			if (device === UserAgentDevice.Android) {
				redirectUrl = scheme.android
			} else {
				redirectUrl = scheme.ios
			}
		}
		res.redirect(redirectUrl)
	}

	@Post()
	@ApiOperation({ summary: 'scheme url 생성' })
	@CommonResponse({ type: PostSchemeAddResponse })
	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard)
	async getSchemeList(@CurrentUser() user: UserModel) {
		const list = await this.schemeService.getSchemeList(user.id)
		return GetSchemeListResponse.builder()
			.schemes(list)
			.build()
	}

	@Get(':id(\\d+)')
	@ApiOperation({ summary: 'scheme url 상세' })
	@CommonResponse({ type: GetSchemeDetailResponse })
	@UseGuards(JwtAuthGuard)
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
