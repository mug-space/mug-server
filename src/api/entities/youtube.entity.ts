import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { DateTransformer } from './date.transformer'
import { YoutubeInfoEntity } from './youtube-info.entity'
import { YoutubeTimestampEntity } from './youtube-timestamp.entity'

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

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

	@OneToOne(() => YoutubeInfoEntity, info => info.youtube, { cascade: true })
	youtubeInfo: YoutubeInfoEntity | null

	@OneToOne(() => YoutubeTimestampEntity, timestamp => timestamp.youtube, { cascade: true })
	youtubeTimestamp: YoutubeTimestampEntity | null

}
