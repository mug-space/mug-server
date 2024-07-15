import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'
import { PointLogModel } from './models/point-log.model'

export class GetPointLogListResponse {

	static readonly builder = () => Builder(this)
	@ApiProperty({ type: PointLogModel, isArray: true })
	pointLogs: PointLogModel[]
}
