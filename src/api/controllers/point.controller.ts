import { Controller, Get, Inject, UnauthorizedException, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/auth/jwt.guard'
import { CurrentUser } from 'src/common/custom.decorator'
import { CommonResponse } from 'src/common/response'
import { UserModel } from '../dtos/models/user.model'
import { GetPointLogListResponse } from '../dtos/point-log.dto'
import { PointService } from '../services/point.service'

@Controller('points')
@ApiTags('Point')
@UseGuards(JwtAuthGuard)
export class PointController {

	@Inject()
	private readonly pointService: PointService

	@Get('logs')
	@ApiOperation({ summary: '포인트 사용 및 충전 내역' })
	@CommonResponse({ type: GetPointLogListResponse })
	async getPointLogList(@CurrentUser() user: UserModel | null) {
		if (!user) {
			throw new UnauthorizedException()
		}
		const pointLogs = await this.pointService.getPointLogList(user.id)
		return GetPointLogListResponse.builder()
			.pointLogs(pointLogs)
			.build()

	}

}
