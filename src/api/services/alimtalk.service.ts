import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class AlimtalkService {

	@Inject()
	private readonly httpService: HttpService

	async sendAuthCode(code: number, phone: string) {
		await this.sendAlimtalk(phone, 'PHONE_AUTH_CODE', { code: code.toString() })
	}

	private async sendAlimtalk(phone: string, templateCode: string, parameter: Record<string, string>) {
		const body = {
			'senderKey': '',
			'templateCode': templateCode,
			'recipientList': [{ 'recipientNo': phone, 'templateParameter': parameter }] }
		const result = await this.httpService.post<AlimtalkResponse>('https://api-alimtalk.cloud.toast.com', body, {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'X-Secret-Key': '',
			},
		}).toPromise()
		console.info(result)
	}
}

interface AlimtalkResponse {
	'header': {
	  'resultCode': number,
	  'resultMessage': string,
	  'isSuccessful': boolean
	},
	'message': {
	  'requestId': string,
	  'senderGroupingKey': string,
	  'sendResults': [
			{
		  'recipientSeq': number,
		  'recipientNo': string,
		  'resultCode': number,
		  'resultMessage': string,
		  'recipientGroupingKey': string
			},
	  ]
	}
}
