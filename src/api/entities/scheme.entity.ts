import {
	Column,
	CreateDateColumn,
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
		comment: 'scheme url type',
	})
	type: SchemeType

	@Column('varchar', {
		nullable: false,
		comment: 'origin url',
	})
	url: string

	@Column('varchar', {
		nullable: false,
		comment: 'ios, web url',
	})
	ios: string

	@Column('varchar', {
		nullable: false,
		comment: 'anroid',
	})
	android: string

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

}
