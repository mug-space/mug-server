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
		console.info(body)
		return
	}

	@Post('signup')
	@ApiOperation({ summary: '회원가입' })
	@CommonResponse({ type: PostAuthSignUpResponse })
	async postSignUp(@Body() body: PostAuthSignUpRequest) {
		console.info(body)
		return
	}

}
