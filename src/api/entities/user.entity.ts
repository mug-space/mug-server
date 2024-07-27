import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Generated,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { DateTransformer } from './date.transformer'

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
	@Generated('uuid')
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

	@Column('varchar', {
		nullable: true,
		comment: '전화번호',
		length: 256,
	})
	phone: string | null

	@Column('varchar', {
		nullable: true,
		comment: '전화번호인증번호 6자리 - 인증받을 폰번호',
		length: 30,
	})
	phoneCode: string | null

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

	@DeleteDateColumn({
		transformer: new DateTransformer(),
	})
	deletedAt: number | null

}
