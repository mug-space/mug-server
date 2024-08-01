// src/sms/sms.service.ts
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SolapiMessageService as msgModule } from 'solapi'

@Injectable()
export class SmsService {

	@Inject()
	private readonly configService: ConfigService

	async sendSms(to: string, text: string) {
		try {
			const messageService = new msgModule(
				this.configService.get('SOLAPI_API_KEY', ''), this.configService.get('SOLAPI_SECRET_KEY', ''))
			const params = {
				text: text,
				to: to,
				from: '01047170851', // 발신번호 (보내는이)
			}
			const result = await messageService.sendOne(params)
			console.log(result)
		} catch (error) {
			console.error(error)
		}

	}

}
