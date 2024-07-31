import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { randomUUID } from 'crypto'

@Injectable()
export class AlimtalkService {

	@Inject()
	private readonly httpService: HttpService

	async sendAuthCode(code: number, phone: string) {
		await this.sendAlimtalk(phone, 'PHONE_AUTH_CODE', { code: code.toString() })
	}

	private async sendAlimtalk(phone: string, templateCode: string, parameter: Record<string, string>) {
		const appkey = 'vAaCzpn7dZbYj6cp'
		const url = 'https://api-alimtalk.cloud.toast.com' + `/alimtalk/v2.3/appkeys/${appkey}/messages`
		const body = {
			'senderKey': randomUUID(),
			'templateCode': templateCode,
			'recipientList': [{ 'recipientNo': phone, 'templateParameter': parameter }] }
		const result = await this.httpService.post<AlimtalkResponse>(url, body, {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'X-Secret-Key': 'ZTCJBhHdYAJkOSqPTpESjyghRpVzKxMT',
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
