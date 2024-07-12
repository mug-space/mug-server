import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('inquiries')
export class InquiryEntity {
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
		comment: '제목',
		length: 100,
	})
	title: string

	@Column('text', {
		nullable: false,
		comment: '본문내용',
	})
	content: string

	@Column('text', {
		nullable: true,
		comment: '답변내용',
	})
	answer: string | null

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@DeleteDateColumn()
	deletedAt: Date | null

}
