import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { PointLogType } from 'src/api/entities/point-log.entity'

export class PointLogModel {
	@Expose()
	@ApiProperty({ type: Number })
	id: number

	@Expose()
	@ApiProperty({ type: PointLogType })
	type: PointLogType

	@Expose()
	@ApiProperty()
	point: number

	@Expose()
	@ApiProperty()
	createdAt: number
}
