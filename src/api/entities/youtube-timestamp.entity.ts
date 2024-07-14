import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

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

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

}
