import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { DateTransformer } from './date.transformer'
import { YoutubeEntity } from './youtube.entity'

export class Caption {
	text: string
	duration: number
	offset: number
	lang?: string
}

@Entity('youtubeInfos')
export class YoutubeInfoEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('int', {
		nullable: false,
		comment: 'youtubes ID',
	})
	youtubeId: number

	@Column('json', {
		nullable: false,
		comment: '전체 자막 데이터',
	})
	captions: Caption[]

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

	@OneToOne(() => YoutubeEntity, youtube => youtube.youtubeInfo, { createForeignKeyConstraints: false })
	@JoinColumn({ name: 'youtubeId' })
	youtube: YoutubeEntity

}
