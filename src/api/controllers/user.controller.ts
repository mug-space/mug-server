import { Body, Controller, Get, Inject, NotFoundException, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BadRequestError } from 'solapi'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import {
	GetUserMeResponse, PostUserSendPhoneCodeRequest, PostUserVerifyPhoneCodeRequest,
	PutUserEmailUpdateRequest, PutUserPasswordUpdateRequest,
} from '../dtos/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserService } from '../services/user.service'

@Controller('users')
@ApiTags('User')
export class UserController {

	@Inject()
	private readonly userService: UserService

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '로그인 유저 정보' })
	@CommonResponse({ type: GetUserMeResponse })
	async userMe(@CurrentUser() user: UserEntity) {
		const userModel = await this.userService.getUserById(user.id)
		if (!userModel) {
			throw new NotFoundException('유저정보를 찾을수 없습니다.')
		}
		return GetUserMeResponse.builder()
			.user(userModel)
			.build()
	}

	@Put('password')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '비밀번호 변경' })
	@CommonResponse({ type: Boolean })
	async changePassword(@CurrentUser() user: UserEntity, @Body() body: PutUserPasswordUpdateRequest) {
		const validPassword = this.userService.validatePassword(body.password)
		if (!validPassword.isValid) {
			throw new BadRequestError(validPassword.messages.join('\n'))
		}
		return await this.userService.updatePassword(user.id, body.password)
	}

	@Put('email')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '이메일 변경' })
	@CommonResponse({ type: Boolean })
	async changeEmail(@CurrentUser() user: UserEntity, @Body() body: PutUserEmailUpdateRequest) {
		return await this.userService.updateEmail(user.id, body.email)
	}

	@Post('send-phone-code')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '전달받은 폰번호로 인증코드 발송' })
	@CommonResponse({ type: Boolean })
	async sendPhoneCode(@CurrentUser() user: UserEntity, @Body() body: PostUserSendPhoneCodeRequest) {
		return await this.userService.sendPhoneCode(user.id, body.phone)
	}

	@Post('verify-phone-code')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '전달받은 폰번호로 인증코드 발송' })
	@CommonResponse({ type: Boolean })
	async verifyPhoneCode(@CurrentUser() user: UserEntity, @Body() body: PostUserVerifyPhoneCodeRequest) {
		return await this.userService.verifyPhoneCode(user.id, body.phoneCode)
	}

}
