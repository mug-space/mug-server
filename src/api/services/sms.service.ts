// src/sms/sms.service.ts
import { Injectable } from '@nestjs/common'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'

@Injectable()
export class SmsService {
	private snsClient: SNSClient

	constructor() {
		this.snsClient = new SNSClient({ region: 'ap-northeast-2' })
	}

	async sendSms(to: string, message: string): Promise<void> {
		const params = {
			Message: message,
			PhoneNumber: to,
		}

		try {
			const command = new PublishCommand(params)
			await this.snsClient.send(command)
			console.log(`Message sent to ${to}`)
		} catch (error) {
			console.error(`Failed to send message to ${to}`, error)
		}
	}
}
