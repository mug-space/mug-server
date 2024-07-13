import { BankCode, CardCompany, PaymentMethod, PaymentStatus } from 'src/api/entities/payment.entity'

class RefundReceiveAccount {
	bankCode: typeof BankCode
	accountNumber: string
	holderName: string
}

class Cancel {
	cancelAmount: number
	cancelReason: string
	taxFreeAmount: number
	taxExemptionAmount: number
	refundableAmount: number
	easyPayDiscountAmount: number
	canceledAt: string
	transactionKey: string
	receiptKey?: string
	cancelStatus: string
	cancelRequestId?: string

}

class Card {
	amount: number
	issuerCode: typeof CardCompany
	acquirerCode?: typeof CardCompany
	number: string
	installmentPlanMonths: number
	approveNo: string
	useCardPoint: boolean
	cardType: CardType
	ownerType: OwnerType
	acquireStatus: AcquireStatus
	isInterestFree: boolean
	interestPayer?: InterestPayer
}

class VirtualAccount {
	accountType: AccountType
	accountNumber: string
	bankCode: string
	customerName: string
	dueDate: string
	refundStatus: RefundStatus
	expired: boolean
	settlementStatus: SettlementStatus
	refundReceiveAccount: RefundReceiveAccount

}

class MobilePhone {
	customerMobilePhone: string
	settlementStatus: SettlementStatus
	receiptUrl: string
}

class GiftCertificate {
	approveNo: string
	settlementStatus: SettlementStatus
}

class Transfer {
	bankCode: typeof BankCode
	settlementStatus: SettlementStatus
}

class Receipt {
	url: string
}

class Checkout {
	url: string
}

class EasyPay {
	provider: EasyPayType
	amount: number
	discountAmount: number
}

class Failure {
	code: string
	message: string
}

class CashReceipt {
	type: string
	receiptKey: string
	issueNumber: string
	receiptUrl: string
	amount: number
	taxFreeAmount: number
}

class Discount {
	amount: number
}

export class TossPayment {
	version: string
	paymentKey: string
	type: PaymentType
	orderId: string
	orderName: string
	mId: string
	currency: string
	method: PaymentMethod
	totalAmount: number
	balanceAmount: number
	status: PaymentStatus
	requestedAt: string
	approvedAt: string
	useEscrow: boolean
	lastTransactionKey?: string
	suppliedAmount: number
	vat: number
	cultureExpense: boolean
	taxFreeAmount: number
	taxExemptionAmount: number
	cancels?: Cancel[]
	card?: Card
	virtualAccount?: VirtualAccount
	mobilePhone?: MobilePhone
	giftCertificate?: GiftCertificate
	transfer?: Transfer
	receipt?: Receipt
	checkout?: Checkout
	easyPay?: EasyPay
	country: string
	failure?: Failure
	cashReceipt?: CashReceipt
	cashReceipts?: CashReceipt[]
	discount?: Discount
	isPartialCancelable: boolean
	secret?: string
}

enum PaymentType {
	NORMAL = 'NORMAL',
	BILLING = 'BILLING',
	BRANDPAY = 'BRANDPAY',
}

enum RefundStatus {
	NONE = 'NONE',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
	PARTIAL_FAILED = 'PARTIAL_FAILED',
	COMPLETED = 'COMPLETED',
}

enum AcquireStatus {
	READY = 'READY',
	REQUESTED = 'REQUESTED',
	COMPLETED = 'COMPLETED',
	CANCEL_REQUESTED = 'CANCEL_REQUESTED',
	CANCELED = 'CANCELED',
}

enum CardType {
	CREDIT = 'CREDIT',
	CHECK = 'CHECK',
	GIFT = 'GIFT',
	UNKNOWN = 'UNKNOWN',
}

enum OwnerType {
	INDIVIDUAL = 'INDIVIDUAL',
	CORPORATE = 'CORPORATE',
	UNKNOWN = 'UNKNOWN',
}

enum InterestPayer {
	BUYER = 'BUYER',
	CARD_COMPANY = 'CARD_COMPANY',
	MERCHANT = 'MERCHANT',
}

enum AccountType {
	일반 = '일반',
	고정 = '고정',
}

enum SettlementStatus {
	INCOMPLETED = 'INCOMPLETED',
	COMPLETED = 'COMPLETED',
}

export enum EasyPayType {
	TOSSPAY = 'TOSSPAY',
	NAVERPAY = 'NAVERPAY',
	SAMSUNGPAY = 'SAMSUNGPAY',
	LPAY = 'LPAY',
	KAKAOPAY = 'KAKAOPAY',
	PAYCO = 'PAYCO',
	SSG = 'SSG',
	APPLEPAY = 'APPLEPAY',
	PINPAY = 'PINPAY',
}
