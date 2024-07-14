import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

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
	captions: Caption

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

}
