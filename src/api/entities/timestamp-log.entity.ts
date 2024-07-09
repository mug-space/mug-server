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

@Entity('timestampLogs')
export class TimestampLogEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('number', {
		nullable: false,
		comment: 'youtubes ID',
	})
	youtubeId: number

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
