import {
	Column,
	CreateDateColumn,
	Entity,
	Generated,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { DateTransformer } from './date.transformer'

@Entity('coupons')
export class CouponEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('varchar', {
		nullable: false,
		comment: 'Coupon uuid',
	})
	@Generated('uuid')
	uuid: string

	@Column('boolean', {
		nullable: false,
		comment: '사용여부',
		default: false,
	})
	isUse: boolean

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

}
