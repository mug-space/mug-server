import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

export interface EmailParams {
	to: string;
	from: string;
	subject: string;
	htmlBody: string;
}

@Injectable()
export class MailService {

	private transporter: nodemailer.Transporter

	constructor(
		private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
		  host: this.configService.get<string>('ZOHO_SMTP_HOST', 'smtp.zoho.com'),
		  port: this.configService.get<number>('ZOHO_SMTP_PORT', 587),
		  secure: false, // true for 465, false for other ports
		  auth: {
				user: this.configService.get<string>('ZOHO_USER', 'contact@mug-space.io'),
				pass: this.configService.get<string>('ZOHO_PASS', 'Kk4903198!'),
		  },
		})
	}

	async sendUserConfirmation(userEmail: string) {
		const url = 'https://mug-space.io'

		const mailOptions = {
		  from: 'contact@mug-space.io',
		  to: userEmail,
		  subject: 'Welcome to MyApp! Confirm your Email',
		  text: `Hello toby, please confirm your email by clicking the following link: ${url}`,
		  html: `<strong>Hello Toby</strong>,<br><br>Please confirm your email by
		  clicking the following link:<br><a href="${url}">Confirm Email</a>`,
		}

		await this.transporter.sendMail(mailOptions)
	  }

}
