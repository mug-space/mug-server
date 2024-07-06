import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('varchar', {
		name: 'sns_uid',
		nullable: false,
		comment: 'SNS 플랫폼 제공 Unique ID',
	})
	snsUid: string

	@Column('varchar', {
		name: 'nick_name',
		nullable: false,
		comment: '닉네임',
		length: 30,
	})
	nickName: string

	@Column('varchar', {
		name: 'email',
		nullable: false,
		comment: '이메일',
		length: 100,
	})
	email: string

	@Column('varchar', {
		name: 'phone',
		nullable: false,
		comment: '전화번호',
		length: 20,
	})
	phone: string

	@Column('varchar', {
		name: 'role',
		nullable: false,
		comment: '전화번호',
		length: 20,
		default: 'user',
	})
	role: string

}
