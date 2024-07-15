import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { DateTransformer } from './date.transformer'

export enum PointLogType {
	사용 = 'MINUS',
	충전 = 'PLUS',
}

@Entity('pointLogs')
export class PointLogEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('int', {
		nullable: false,
		comment: 'users ID',
	})
	userId: number

	@Column('int', {
		nullable: false,
		comment: '사용 / 충전 포인트',
	})
	point: number

	@Column('varchar', {
		nullable: false,
		comment: '사용, 충전 여부 타입',
	})
	type: PointLogType

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

}
