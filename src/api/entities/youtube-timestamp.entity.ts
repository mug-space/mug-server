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

	@Column('number', {
		nullable: false,
		comment: 'youtubes ID',
	})
	youtubeId: number

	@Column('varchar', {
		nullable: false,
		comment: '처리상태',
	})
	status: YoutubeTimestampStatus

	@Column('json', {
		nullable: false,
		comment: '영상 재생 시간',
	})
	timestamps: TimeStampModel[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

}
