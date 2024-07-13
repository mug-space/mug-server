import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('uuid', {
		nullable: false,
		comment: 'user uuid',
	})
	uuid: string

	@Column('varchar', {
		nullable: false,
		comment: '로그인 계정명',
	})
	account: string

	@Column('varchar', {
		name: 'email',
		nullable: false,
		comment: '이메일',
		length: 100,
	})
	email: string

	@Column('varchar', {
		nullable: false,
		comment: '비밀번호',
		length: 256,
	})
	password: string

	@Column('int', {
		nullable: false,
		comment: '잔여 point',
		default: 0,
	})
	point: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@DeleteDateColumn()
	deletedAt: Date | null

}
