import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { SchemeType } from '../dtos/models/scheme.model'
import { DateTransformer } from './date.transformer'

@Entity('schemes')
export class SchemeEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('int', {
		nullable: false,
		comment: 'users ID',
	})
	userId: number

	@Column('varchar', {
		nullable: false,
		comment: 'scheme url 맨뒤에 붙을 path',
	})
	path: string

	@Column('varchar', {
		nullable: false,
		comment: 'scheme url type',
	})
	type: SchemeType

	@Column('varchar', {
		nullable: false,
		comment: 'origin url',
	})
	url: string

	@Column('datetime', {
		nullable: false,
		comment: '만료일',
		transformer: new DateTransformer(),
	})
	expiredAt: number

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
