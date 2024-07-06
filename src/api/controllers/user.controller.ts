import { Body, Controller, Get, Inject, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import {
	GetUserMeResponse,
} from '../dtos/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserService } from '../services/user.service'

@Controller('users')
@ApiTags('User')
export class UserController {

	@Inject()
	private readonly configService: ConfigService

	@Inject()
	private readonly userService: UserService

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '로그인 유저 정보' })
	@CommonResponse({ type: GetUserMeResponse })
	async userMe(@CurrentUser() user: UserEntity | null) {
		if (!user) {
			throw new UnauthorizedException('로그인이 되어있지 않습니다.')
		}
		const userModel = await this.userService.getUserById(user.id)
		if (!userModel) {
			throw new NotFoundException('유저정보를 찾을수 없습니다.')
		}
		return GetUserMeResponse.builder()
			.user(userModel)
			.build()
	}

}
