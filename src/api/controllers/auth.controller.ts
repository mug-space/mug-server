import { Body, Controller, Get, Inject, NotFoundException, Post, Res, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CommonResponse } from 'src/common/response'
import { PostAuthSignInRequest, PostAuthSignInResponse, PostAuthSignUpRequest, PostAuthSignUpResponse } from '../dtos/auth.dto'
import { UserService } from '../services/user.service'
import { Response } from 'express'

@Controller('auths')
@ApiTags('Auth')
export class AuthController {

	@Inject()
	private readonly configService: ConfigService

	@Inject()
	private readonly userService: UserService

	@Post('signin')
	@ApiOperation({ summary: '로그인' })
	@CommonResponse({ type: PostAuthSignInResponse })
	async postSignIn(@Body() body: PostAuthSignInRequest, @Res({ passthrough: true }) res: Response) {
		const user = await this.userService.getUserByAccount(body.account)
		if (!user) {
			throw new UnauthorizedException('가입되어있지않은 계정입니다.')
		}
		const isMatch = await this.userService.comparePassword(user.id, body.password)
		if (!isMatch) {
			throw new UnauthorizedException('비밀번호가 일치하지않습니다.')
		}
		const token = await this.userService.makeToken(user)
		res.cookie('auth', { token }, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30일
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			domain: '.mug-space.io',
		})
		return PostAuthSignInResponse.builder()
			.result(true)
			.build()
	}

	@Post('signup')
	@ApiOperation({ summary: '회원가입' })
	@CommonResponse({ type: PostAuthSignUpResponse })
	async postSignUp(@Body() body: PostAuthSignUpRequest, @Res({ passthrough: true }) res: Response) {
		const user = await this.userService.createUser(body.account, body.email, body.password)
		const token = await this.userService.makeToken(user)
		res.cookie('auth', { token }, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30일
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			domain: '.mug-space.io',
		})
		res.cookie('is_signin', true, {
			maxAge: 1000 * 60 * 60 * 24 * 60, // 30일
			domain: '.mug-space.io',
		})
		return PostAuthSignUpResponse.builder()
			.result(true)
			.build()
	}

	// TODO: ID 찾기

	// TODO: PASSWORD 찾기

}
