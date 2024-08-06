import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TossPayment } from '../dtos/models/toss-payment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentRepository } from '../repositories/payment.repository'
import { plainToInstance } from 'class-transformer'
import { PaymentModel } from '../dtos/models/payment.model'

const SECRET_KEY = 'test_gsk_KNbdOvk5rky91oEepNG43n07xlzm'

@Injectable()
export class PaymentService {

	@Inject()
	private readonly configService: ConfigService
	@Inject()
	private readonly httpService: HttpService
	@InjectRepository(PaymentRepository)
	private readonly paymentRepository: PaymentRepository

	async confirmPayment(orderId: string, paymentKey: string, amount: number) {
		try {
			const secretKey = this.configService.get('TOSS_SECRET_KEY', SECRET_KEY)
			const encryptedSecretKey =
    'Basic ' + Buffer.from(secretKey + ':').toString('base64')
			const response = await this.httpService.post<TossPayment>('https://api.tosspayments.com/v1/payments/confirm',
				JSON.stringify({ orderId, amount, paymentKey }),
				{ headers: {
					Authorization: encryptedSecretKey,
					'Content-Type': 'application/json',
				} }
			).toPromise()
			if (response) {
				return response.data
			}
			return null
		} catch (error) {
			console.error(error)
			return null
		}

	}

	async addPayment(tossPayment: TossPayment, userId: number) {
		const payment = this.paymentRepository.create({
			status: tossPayment.status,
			paymentKey: tossPayment.paymentKey,
			orderId: tossPayment.orderId,
			orderName: tossPayment.orderName,
			method: tossPayment.method,
			userId: userId,
			totalAmount: tossPayment.totalAmount,
			paymentInfo: tossPayment,
		})
		await this.paymentRepository.save(payment)
	}

	async updatePayment(tossPayment: TossPayment, paymentKey: string) {
		await this.paymentRepository.update({
			paymentKey,
		}, {
			paymentInfo: tossPayment,
		})
	}

	async getPaymentList(userId: number) {
		const paymentList = await this.paymentRepository.find({ where: { userId: userId }, order: { id: 'DESC' } })

		return paymentList.map((payment) => {
			return plainToInstance(PaymentModel, {
				...payment,
				receipt: payment.paymentInfo.receipt,
				easyPay: payment.paymentInfo.easyPay,
			}, { excludeExtraneousValues: true })
		})

	}

	async getPaymentByPaymentKey(paymentKey: string) {
		const payment = await this.paymentRepository.findOne({ where: {
			paymentKey,
		} })
		if (payment) {
			return plainToInstance(PaymentModel, {
				...payment,
				receipt: payment.paymentInfo.receipt,
				easyPay: payment.paymentInfo.easyPay,
			}, { excludeExtraneousValues: true })
		}
		return null
	}

}
