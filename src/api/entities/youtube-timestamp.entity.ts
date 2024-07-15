import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { DateTransformer } from './date.transformer'

class TimeStampModel {
	time: string
	title: string
}

export enum YoutubeTimestampStatus {
	NOT_COMPLETED = 'NOT_COMPLETED',
	ERROR = 'ERROR',
	COMPLETED = 'COMPLETED',
}

@Entity('youtubeTimestamps')
export class YoutubeTimestampEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('int', {
		nullable: false,
		comment: 'youtubes ID',
	})
	youtubeId: number

	@Column('varchar', {
		nullable: false,
		comment: '처리상태',
		default: YoutubeTimestampStatus.NOT_COMPLETED,
	})
	status: YoutubeTimestampStatus

	@Column('json', {
		nullable: false,
		comment: 'timestamp list',
	})
	timestamps: TimeStampModel[]

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

}
