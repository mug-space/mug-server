import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { TossPayment } from '../dtos/models/toss-payment.dto'
import { DateTransformer } from './date.transformer'

@Entity('payments')
export class PaymentEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
	})
	id: number

	@Column('varchar', {
		name: 'status',
		nullable: false,
	})
	status: PaymentStatus

	@Column('varchar', {
		nullable: false,
		comment: '결제 고유번호',
	})
	paymentKey: string

	@Column('varchar', {
		nullable: false,
		comment: '주문번호',
	})
	orderId: string

	@Column('varchar', {
		nullable: false,
		comment: '구매상품',
	})
	orderName: string

	@Column('varchar', {
		nullable: false,
		comment: '결제방법',
		length: 16,
	})
	method: PaymentMethod

	@Column('int', {
		nullable: false,
		comment: 'users ID',
	})
	userId: number

	@Column('int', {
		nullable: false,
		comment: '결제 금액',
	})
	totalAmount: number

	@Column('json', {
		nullable: true,
	})
	paymentInfo: TossPayment

	@CreateDateColumn({
		transformer: new DateTransformer(),
	})
	createdAt: number

	@UpdateDateColumn({
		transformer: new DateTransformer(),
	})
	updatedAt: number

}

export enum PaymentMethod {
	CARD = 'CARD',
	EASY_PAY = 'EASY_PAY',
	VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
	MOBILE_PHONE = 'MOBILE_PHONE',
	TRANSFER = 'TRANSFER',
	CULTURE_GIFT_CERTIFICATE = 'CULTURE_GIFT_CERTIFICATE',
	BOOK_GIFT_CERTIFICATE = 'BOOK_GIFT_CERTIFICATE',
	GAME_GIFT_CERTIFICATE = 'GAME_GIFT_CERTIFICATE',
}

export enum PaymentStatus {
	READY = 'READY',
	IN_PROGRESS = 'IN_PROGRESS',
	WAITING_FOR_DEPOSIT = 'WAITING_FOR_DEPOSIT',
	DONE = 'DONE',
	CANCELED = 'CANCELED',
	PARTIAL_CANCELED = 'PARTIAL_CANCELED',
	ABORTED = 'ABORTED',
	EXPIRED = 'EXPIRED',
}

export const BankCode = {
	'39': 'KYONGNAMBANK',
	'34': 'GWANGJUBANK',
	'12': 'LOCALNONGHYEOP',
	'32': 'BUSANBANK',
	'45': 'SAEMAUL',
	'64': 'SANLIM',
	'88': 'SHINHAN',
	'48': 'SHINHYEOP',
	'27': 'CITI',
	'20': 'WOORI',
	'71': 'POST',
	'50': 'SAVINGBANK',
	'37': 'JEONBUKBANK',
	'35': 'JEJUBANK',
	'90': 'KAKAOBANK',
	'89': 'KBANK',
	'92': 'TOSSBANK',
	'81': 'HANA',
	'54': 'HSBC',
	'03': 'IBK',
	'06': 'KOOKMIN',
	'31': 'DAEGUBANK',
	'02': 'KDBBANK',
	'11': 'NONGHYEOP',
	'23': 'SC',
	'07': 'SUHYEOP',
}

export const CardCompany = {
	'36': 'CITI',
	'33': 'WOORI',
	'37': 'POST',
	'39': 'SAVINGBANK',
	'35': 'JEONBUKBANK',
	'42': 'JEJUBANK',
	'15': 'KAKAOBANK',
	'3A': 'KBANK',
	'24': 'TOSSBANK',
	'21': 'HANA',
	'61': 'HYUNDAI',
	'11': 'KOOKMIN',
	'91': 'NONGHYEOP',
	'34': 'SUHYEOP',
	'6D': 'DINERS',
	'4M': 'MASTER',
	'3C': 'UNIONPAY',
	'7A': 'AMEX',
	'4J': 'JCB',
	'4V': 'VISA',
	'W1': 'WOORI',
	'3K': 'IBK_BC',
	'46': 'GWANGJUBANK',
}
