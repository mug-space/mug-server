import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'
import {
	GetUserDeliveryResponse,
	GetUserMeResponse,
	PostUserMeRequest,
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
		const userEntity = await this.userService.getUserById(user?.id ?? 0)
		return GetUserMeResponse.builder()
			.id(userEntity?.id ?? 0)
			.snsUid(userEntity?.snsUid ?? null)
			.email(userEntity?.email ?? null)
			.nickName(userEntity?.nickName ?? null)
			.phone(userEntity?.phone ?? null)
			.role(userEntity?.role ?? null)
			.build()
	}

	@Post('me')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '로그인 유저 정보 등록/수정' })
	@CommonResponse({ type: GetUserMeResponse })
	async postUserMe(@CurrentUser() user: UserEntity | null, @Body() body: PostUserMeRequest) {
		const userModel = new UserModel()
		userModel.id = user?.id ?? 0
		userModel.snsUid = user?.snsUid ?? null
		userModel.nickName = body.nickName ?? null
		userModel.phone = body.phone ?? null
		userModel.email = body.email ?? null
		return this.userService.setUser(userModel)

	}

	/**
	 * 배송지 등록 / 수정
	 */
	// @Post('delivery')
	// @UseGuards(JwtAuthGuard)
	// @ApiOperation({ summary: '배송지 등록/수정' })
	// @CommonResponse({ type: BaseResponse })
	// async postUserDelivery(@CurrentUser() user: UserEntity, @Body() body: PostUserDeliveryRequest) {
	// 	this.userService.setUserDelivery(user.id, body)

	// 	return BaseResponse.builder().build()
	// }

	/**
	 * 배송지 조회
	 */
	@Get('delivery')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: '배송지 조회' })
	@CommonResponse({ type: GetUserDeliveryResponse })
	async getUserDelivery(@CurrentUser() user: UserEntity) {
		return await this.userService.getUserDelivery(user.id)
	}
}
