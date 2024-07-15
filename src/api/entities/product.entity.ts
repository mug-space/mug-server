import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class ProductEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('boolean', {
		nullable: false,
		comment: '사용여부',
		default: true,
	})
	enabled: boolean

	@Column('varchar', {
		nullable: false,
		comment: '제목',
	})
	title: string

	@Column('int', {
		nullable: false,
		comment: '가격',
	})
	amount: number

	@Column('int', {
		nullable: false,
		comment: '충전 포인트',
	})
	point: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

}
