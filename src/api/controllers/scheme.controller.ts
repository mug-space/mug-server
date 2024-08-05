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
import { PointService } from '../services/point.service'
import { SchemeService, UserAgentDevice } from '../services/scheme.service'

@Controller()
@ApiTags('Scheme')
export class SchemeController {

	@Inject()
	private readonly schemeService: SchemeService
	@Inject()
	private readonly pointService: PointService

	@Get('s/check-device')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async checkDevice(@Req() req: Request) {
		const userAgent = req.headers['user-agent']
		return this.schemeService.detectDevice(userAgent)
	}

	@Get('yt/c/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectYoutubeChannel(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.YOUTUBE_CHANNEL)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			const device = this.schemeService.detectDevice(userAgent)
			if (device === UserAgentDevice.Android) {
				redirectUrl = this.schemeService.makeYoutubeAndroidSchemeUrl(scheme.url)
			} else if (device === UserAgentDevice.iOS) {
				redirectUrl = this.schemeService.makeYoutubeIOSSchemeUrl(scheme.url)
			} else {
				redirectUrl = scheme.url
			}
			res.send(this.schemeService.makeResponseHtml(redirectUrl, scheme.url))
		} else {
			res.redirect('https://mug-space.io')
		}

	}

	@Get('yt/v/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectYoutubeVideo(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.YOUTUBE_VIDEO)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			const device = this.schemeService.detectDevice(userAgent)
			if (device === UserAgentDevice.Android) {
				redirectUrl = this.schemeService.makeYoutubeAndroidSchemeUrl(scheme.url)
			} else if (device === UserAgentDevice.iOS) {
				redirectUrl = this.schemeService.makeYoutubeIOSSchemeUrl(scheme.url)
			} else {
				redirectUrl = scheme.url
			}
			res.send(this.schemeService.makeResponseHtml(redirectUrl, scheme.url))
		} else {
			res.redirect('https://mug-space.io')
		}
	}

	@Get('ig/u/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectInstagramProfile(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.INSTAGRAM_PROFILE)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			const device = this.schemeService.detectDevice(userAgent)
			const urls = this.schemeService.makeInstagramProfileUrl(scheme.url)
			if (device === UserAgentDevice.Android || device === UserAgentDevice.iOS ) {
				redirectUrl = urls.mobileUrl
			} else {
				redirectUrl = urls.webUrl
			}
			res.send(this.schemeService.makeInstagramResponseHtml(redirectUrl, urls.webUrl))
		} else {
			res.redirect('https://mug-space.io')
		}
	}

	@Get('ig/p/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectInstagramPost(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.INSTAGRAM_POST)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			const device = this.schemeService.detectDevice(userAgent)
			const urls = this.schemeService.makeInstagramPostUrls(scheme.url)
			if (device === UserAgentDevice.Android || device === UserAgentDevice.iOS ) {
				redirectUrl = urls.mobileUrl
			} else {
				redirectUrl = urls.webUrl
			}
			res.send(this.schemeService.makeInstagramResponseHtml(redirectUrl, urls.webUrl))
		} else {
			res.redirect('https://mug-space.io')
		}
	}

	@Get('fb/u/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectFacebookProfile(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.FACEBOOK_PROFILE)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			const device = this.schemeService.detectDevice(userAgent)
			const urls = this.schemeService.makeFacebookProfileUrls(scheme.url)
			if (device === UserAgentDevice.Android || device === UserAgentDevice.iOS ) {
				redirectUrl = urls.mobileUrl
			} else {
				redirectUrl = urls.webUrl
			}
			res.send(this.schemeService.makeFacebookResponseHtml(redirectUrl, urls.webUrl))
		} else {
			res.redirect('https://mug-space.io')
		}
	}

	@Get('fb/p/:path')
	// @UseGuards(DomainGuard)
	@ApiExcludeEndpoint()
	async redirectFacebookPost(@Param('path') path: string, @Req() req: Request, @Res() res: Response) {
		const scheme = await this.schemeService.getSchemeByPathAndType(path, SchemeType.FACEBOOK_POST)
		let redirectUrl = 'https://mug-space.io'
		if (scheme) {
			const userAgent = req.headers['user-agent']
			const device = this.schemeService.detectDevice(userAgent)
			const urls = this.schemeService.makeFacebookPostUrls(scheme.url)
			if (device === UserAgentDevice.Android || device === UserAgentDevice.iOS ) {
				redirectUrl = urls.mobileUrl
			} else {
				redirectUrl = urls.webUrl
			}
			res.send(this.schemeService.makeFacebookResponseHtml(redirectUrl, urls.webUrl))
		} else {
			res.redirect('https://mug-space.io')
		}
	}

	@Post('schemes')
	@ApiOperation({ summary: 'scheme url 생성' })
	@CommonResponse({ type: PostSchemeAddResponse })
	@UseGuards(JwtAuthGuard)
	async addSchemeUrl(@Body() body: PostSchemeAddRequest, @CurrentUser() user: UserModel) {
		const isValidUrl = this.schemeService.validUrl(body.type, body.url)
		if (!isValidUrl) {
			throw new BadRequestException('잘못된 주소 입니다.')
		}
		const decrementPoint = this.schemeService.getPointByType(body.type)
		const hasPoint = await this.pointService.hasPoint(user.id, decrementPoint)
		if (!hasPoint) {
			throw new BadRequestException('포인트가 충분하지 않습니다.')
		}
		const scheme = await this.schemeService.addScheme(body.url, body.type, body.path, user.id)
		await this.pointService.decrementPoint(user.id, decrementPoint)
		return PostSchemeAddResponse.builder()
			.scheme(scheme)
			.build()
	}

	@Put('schemes/:id(\\d+)')
	@ApiOperation({ summary: 'scheme url 수정' })
	@CommonResponse({ type: PutSchemeModifyResponse })
	@UseGuards(JwtAuthGuard)
	async updateSchemeUrl(@Param('id') id: number, @Body() body: PutSchemeModifyRequest, @CurrentUser() user: UserModel) {
		const scheme = await this.schemeService.getSchemeDetail(id, user.id)
		if (!scheme) {
			throw new NotFoundException('데이터를 찾을수 없습니다.')
		}
		const isValidUrl = this.schemeService.validUrl(scheme.type, body.url)
		if (!isValidUrl) {
			throw new BadRequestException('잘못된 주소 입니다.')
		}
		const decrementPoint = this.schemeService.getPointByType(scheme.type)
		const modifyDecrementPoint = decrementPoint / 2
		const hasPoint = await this.pointService.hasPoint(user.id, modifyDecrementPoint)
		if (!hasPoint) {
			throw new BadRequestException('포인트가 충분하지 않습니다.')
		}
		const updatedScheme = await this.schemeService.updateScheme(id, body.url, user.id)
		if (!updatedScheme) {
			throw new NotFoundException('데이터를 찾을수 없습니다.')
		}
		await this.pointService.decrementPoint(user.id, modifyDecrementPoint)
		return PutSchemeModifyResponse.builder()
			.scheme(updatedScheme)
			.build()
	}

	@Get('schemes')
	@ApiOperation({ summary: 'scheme url 목록' })
	@CommonResponse({ type: GetSchemeListResponse })
	@UseGuards(JwtAuthGuard)
	async getSchemeList(@CurrentUser() user: UserModel) {
		const list = await this.schemeService.getSchemeList(user.id)
		return GetSchemeListResponse.builder()
			.schemes(list)
			.build()
	}

	@Get('schemes/:id(\\d+)')
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
