import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { UserModel } from '../dtos/models/user.model'
import { UserRepository } from '../repositories/user.repository'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { SmsService } from './sms.service'
import { MoreThanOrEqual } from 'typeorm'

@Injectable()
export class UserService {

	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository
	@Inject()
	private readonly jwtService: JwtService
	@Inject()
	private readonly smsService: SmsService

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
			// await this.smsService.sendSms(rawPhone, `인증번호는\n[${phoneCode}] 입니다.`)
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
		return 123456
		// return Math.floor(100000 + Math.random() * 900000)
	}

	private removeHyphens(str: string): string {
		return str.replace(/-/g, '').trim()
	  }

}
