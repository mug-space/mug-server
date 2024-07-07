import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CommonResponse } from 'src/common/response'
import { PostAuthSignInRequest, PostAuthSignInResponse, PostAuthSignUpRequest, PostAuthSignUpResponse } from '../dtos/auth.dto'
import { UserService } from '../services/user.service'

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
	async postSignIn(@Body() body: PostAuthSignInRequest) {
		const user = await this.userService.getUserByAccount(body.account)
		if (!user) {
			throw new UnauthorizedException('가입되어있지않은 계정입니다')
		}
		return
	}

	@Post('signup')
	@ApiOperation({ summary: '회원가입' })
	@CommonResponse({ type: PostAuthSignUpResponse })
	async postSignUp(@Body() body: PostAuthSignUpRequest) {
		const user = await this.userService.createUser(body.account, body.email, body.password)
		const toekn = await this.userService.makeToken(user)
		return PostAuthSignUpResponse.builder()
			.token(toekn)
			.build()
	}

}
