import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('youtubes')
export class YoutubeEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('varchar', {
		nullable: false,
		comment: 'youtube video ID',
	})
	videoId: string

	@Column('int', {
		nullable: false,
		comment: 'users ID',
	})
	userId: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

}
