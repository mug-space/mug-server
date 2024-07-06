import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UserModel } from '../dtos/models/user.model'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UserService {

	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository

	async getUserById(id: number) {
		const user = await this.userRepository.findOne({ where: {
			id,
		} })
		if (user) {
			return plainToInstance(UserModel, user, { excludeExtraneousValues: true })
		}
		return null
	}
}
