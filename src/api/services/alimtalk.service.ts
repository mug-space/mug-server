import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AlimtalkService {

	@Inject()
	private readonly httpService: HttpService
	@Inject()
	private readonly configService: ConfigService

	async sendAuthCode(code: number, phone: string) {
		try {
			await this.sendAlimtalk(phone, 'PHONE_AUTH_CODE', { code: code.toString() })
			return true
		} catch (error) {
			console.error(error)
			return false
		}

	}

	private async sendAlimtalk(phone: string, templateCode: string, parameter: Record<string, string>) {
		try {
			const appkey = this.configService.get('KAKAO_APPKEY')
			const url = 'https://api-alimtalk.cloud.toast.com' + `/alimtalk/v2.3/appkeys/${appkey}/messages`
			const body = {
				'senderKey': '0a26d4406b86762383c4fc700e40f23d72ea1361',
				'templateCode': templateCode,
				'recipientList': [{ 'recipientNo': phone, 'templateParameter': parameter }] }
			const result = await this.httpService.post<AlimtalkResponse>(url, body, {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8',
					'X-Secret-Key': this.configService.get('KAKAO_SECRET_KEY', ''),
				},
			}).toPromise()
			console.info(result)
		} catch (error) {
			console.error(error)
		}

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
