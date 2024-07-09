import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

export enum BillingStatus {
	INIT = 'init',
	READY = 'ready',
	PAID = 'paid',
	CANCELLED = 'cancelled',
}

export enum BillingPayMethod {
	CARD = 'card',
	VBANK = 'vbank',
	NAVER = 'naverpay',
	KAKAO = 'kakaopay',
}

export enum BillingVBankName {
	'039' = '경남은행',
	'034' = '광주은행',
	'012' = '단위농협(지역농축협)',
	'032' = '부산은행',
	'045' = '새마을금고',
	'064' = '산림조합',
	'088' = '신한은행',
	'048' = '신협',
	'027' = '씨티은행',
	'020' = '우리은행',
	'071' = '우체국예금보험',
	'050' = '저축은행중앙회',
	'037' = '전북은행',
	'035' = '제주은행',
	'090' = '카카오뱅크',
	'092' = '토스뱅크',
	'081' = '하나은행',
	'054' = '홍콩상하이은행',
	'003' = 'IBK기업은행',
	'004' = 'KB국민은행',
	'031' = 'DGB대구은행',
	'002' = 'KDB산업은행',
	'011' = 'NH농협은행',
	'023' = 'SC제일은행',
	'007' = 'Sh수협은행',
}

export interface BillingCancelInfo {
	vBankHolder: string
	vBankAccount: string
	vBankCode: string
	vBankName: string
}

@Entity('billings')
export class BillingEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('varchar', {
		name: 'status',
		nullable: false,
	})
	status: BillingStatus

	@Column('varchar', {
		nullable: false,
		comment: '결제 고유번호',
	})
	impUid: string

	@Column('varchar', {
		nullable: false,
		comment: '주문번호',
	})
	merchantUid: string

	@Column('varchar', {
		nullable: false,
		comment: '결제방법',
		length: 16,
	})
	payMethod: BillingPayMethod

	@Column('int', {
		nullable: false,
		comment: 'users ID',
	})
	userId: number

	@Column('int', {
		nullable: false,
		comment: '결제 금액',
	})
	amount: number

	@Column('json', {
		nullable: true,
	})
	payInfo: BillingPayInfo | null

	@Column('json', {
		nullable: true,
	})
	cancelInfo: BillingCancelInfo | null

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@DeleteDateColumn()
	deletedAt: Date | null

}

interface BillingPayInfo {
	'imp_uid': string,
	'merchant_uid': string,
	'pay_method': string,
	'channel': string,
	'pg_provider': string,
	'emb_pg_provider': string,
	'pg_tid': string,
	'pg_id': string,
	'escrow': boolean,
	'apply_num': string,
	'bank_code': string,
	'bank_name': string,
	'card_code': string,
	'card_name': string,
	'card_quota': number,
	'card_number': string,
	'card_type': string,
	'vbank_code': string,
	'vbank_name': string,
	'vbank_num': string,
	'vbank_holder': string,
	'vbank_date': number,
	'vbank_issued_at': number,
	'name': string,
	'amount': number,
	'cancel_amount': number,
	'currency': string,
	'buyer_name': string,
	'buyer_email': string,
	'buyer_tel': string,
	'buyer_addr': string,
	'buyer_postcode': string,
	'custom_data': string,
	'user_agent': string,
	'status': string,
	'started_at': number,
	'paid_at': number,
	'failed_at': number,
	'cancelled_at': number,
	'fail_reason': string,
	'cancel_reason': string,
	'receipt_url': string,
	'cancel_history': {
		'pg_tid': string,
		'amount': number,
		'cancelled_at': number,
		'reason': string,
		'receipt_url': string,
	}[],
	'cancel_receipt_urls': string[],
	'cash_receipt_issued': boolean,
	'customer_uid': string,
	'customer_uid_usage': string,
}
