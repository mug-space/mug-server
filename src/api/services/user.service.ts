import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { UserModel } from '../dtos/models/user.model'
import { UserRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { SmsService } from './sms.service'
import { IsNull, MoreThanOrEqual } from 'typeorm'
import { AlimtalkService } from './alimtalk.service'

@Injectable()
export class UserService {

	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository
	@Inject()
	private readonly jwtService: JwtService
	@Inject()
	private readonly smsService: SmsService
	@Inject()
	private readonly alimtalkService: AlimtalkService

	validatePassword(password: string): { isValid: boolean, messages: string[] } {
		const messages: string[] = []
		if (password.length < 8 || password.length > 19) {
			messages.push('비밀번호는 8자 이상 19자 이하여야 합니다.')
			// messages.push('Password must be between 8 and 19 characters long.')
		}
		if (!/[a-z]/.test(password)) {
			messages.push('비밀번호에는 최소한 하나의 소문자가 포함되어야 합니다.')
			// messages.push('Password must contain at least one lowercase letter.')
		}
		if (!/[A-Z]/.test(password)) {
			messages.push('비밀번호에는 최소한 하나의 대문자가 포함되어야 합니다.')
			// messages.push('Password must contain at least one uppercase letter.')
		}
		if (!/\d/.test(password)) {
			messages.push('비밀번호에는 최소한 하나의 숫자가 포함되어야 합니다.')
			// messages.push('Password must contain at least one number.')
		}
		if (!/[@$!%*?&]/.test(password)) {
			messages.push('비밀번호에는 최소한 하나의 특수 문자(@$!%*?&)가 포함되어야 합니다.')
			// messages.push('Password must contain at least one special character (@$!%*?&).')
		}

		return {
			isValid: messages.length === 0,
			messages: messages,
		}
	}

	async existAccount(account: string) {
		const exist = await this.userRepository.exists({ where: {
			account, deletedAt: IsNull(),
		} })
		return exist
	}

	async hasPoint(userId: number, point: number) {
		return this.userRepository.exists({
			where: {
				id: userId, point: MoreThanOrEqual(point),
			},
		})
	}

	async sendPhoneCode(userId: number, phone: string) {
		const phoneCode = this.makePhoneCode()
		const rawPhone = this.removeHyphens(phone)
		const user = await this.userRepository.findOne({ where: { id: userId } })
		if (user) {
			user.phoneCode = `${phoneCode}-${rawPhone}`
			await this.userRepository.save(user)
			const sendResult = await this.alimtalkService.sendAuthCode(phoneCode, rawPhone)
			if (!sendResult) {
				await this.smsService.sendSms(rawPhone, `인증번호는\n[${phoneCode}] 입니다.`)
			}
			return true
		}
		return false
	}

	async verifyPhoneCode(userId: number, phoneCode: string) {
		const user = await this.userRepository.findOne({ where: { id: userId } })
		if (user && user.phoneCode) {
			const phoneCodeArr = user.phoneCode.split('-')
			if (phoneCode === phoneCodeArr[0]) {
				user.phone = phoneCodeArr[1]
				await this.userRepository.save(user)
				return true
			}
		}
		return false
	}

	async updateEmail(userId: number, email: string) {
		const user = await this.userRepository.findOne({ where: { id: userId } })
		if (!user) {
			return false
		}
		user.email = email
		await this.userRepository.save(user)
		return true
	}

	async updatePassword(userId: number, password: string) {
		const user = await this.userRepository.findOne({ where: { id: userId } })
		if (!user) {
			return false
		}
		const hashedPassword = await this.makePassword(password)
		user.password = hashedPassword
		await this.userRepository.save(user)
		return true

	}

	async getUserByAccount(account: string) {
		const user = await this.userRepository.findOne({ where: {
			account,
		} })
		if (user) {
			return plainToInstance(UserModel, user, { excludeExtraneousValues: true })
		}
		return null
	}

	async getUserById(id: number) {
		const user = await this.userRepository.findOne({ where: {
			id,
		} })
		if (user) {
			return plainToInstance(UserModel, user, { excludeExtraneousValues: true })
		}
		return null
	}

	async createUser(account: string, email: string, password: string) {
		const hashedPassword = await this.makePassword(password)
		const user = this.userRepository.create({
			account, email, password: hashedPassword,
		})
		await this.userRepository.save(user)
		return plainToInstance(UserModel, user, { excludeExtraneousValues: true })
	}

	async makeToken(user: UserModel) {
		return await this.jwtService.signAsync(instanceToPlain(user))
	}

	private async makePassword(password: string) {
		const saltOrRounds = 10
		const hash = await bcrypt.hash(password, saltOrRounds)
		return hash
	}

	async comparePassword(userId: number, password: string) {
		const user = await this.userRepository.findOne({ where: {
			id: userId,
		} })
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password)
			return isMatch
		}
		return false
	}

	private makePhoneCode() {
		return Math.floor(100000 + Math.random() * 900000)
	}

	private removeHyphens(str: string): string {
		return str.replace(/-/g, '').trim()
	  }

}
