import { Injectable } from '@nestjs/common'
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { fromEnv } from '@aws-sdk/credential-providers'

// AWS SES 클라이언트 설정
const sesClient = new SESClient({
	region: 'ap-northeast-2',
	// credentials: fromEnv(),
})

export interface EmailParams {
	to: string;
	from: string;
	subject: string;
	htmlBody: string;
}

@Injectable()
export class MailService {

	async sendHtmlEmail({ to, from, subject, htmlBody }: EmailParams): Promise<void> {
		const params = {
		  Destination: {
				ToAddresses: [ to ],
		  },
		  Message: {
				Body: {
			  Html: {
						Charset: 'UTF-8',
						Data: htmlBody,
			  },
				},
				Subject: {
			  Charset: 'UTF-8',
			  Data: subject,
				},
		  },
		  Source: `=?UTF-8?B?${Buffer.from('머그스페이스').toString('base64')}?= <${from}>`,
		}

		try {
		  const command = new SendEmailCommand(params)
		  const result = await sesClient.send(command)
		  console.log(`Email sent! Message ID: ${result.MessageId}`)
		} catch (error) {
		  console.error(`Failed to send email: ${error}`)
		}
	  }

}
