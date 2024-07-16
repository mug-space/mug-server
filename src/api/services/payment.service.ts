import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TossPayment } from '../dtos/models/toss-payment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentRepository } from '../repositories/payment.repository'
import { plainToInstance } from 'class-transformer'
import { PaymentModel } from '../dtos/models/payment.model'

const SECRET_KEY = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'

@Injectable()
export class PaymentService {

	@Inject()
	private readonly configService: ConfigService
	@Inject()
	private readonly httpService: HttpService
	@InjectRepository(PaymentRepository)
	private readonly paymentRepository: PaymentRepository

	async confirmPayment(orderId: string, paymentKey: string, amount: number) {
		const secretKey = this.configService.get('TOSS_SECRET_KEY' || SECRET_KEY)
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

	async getPaymentList(userId: number) {
		const paymentList = await this.paymentRepository.find({ where: { userId: userId }, order: { id: 'DESC' } })
		return plainToInstance(PaymentModel, paymentList, { excludeExtraneousValues: true })
	}

}
