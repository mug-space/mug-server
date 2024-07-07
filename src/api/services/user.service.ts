import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { UserModel } from '../dtos/models/user.model'
import { UserRepository } from '../repositories/user.repository'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {

	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository
	@Inject()
	private readonly jwtService: JwtService

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

}
