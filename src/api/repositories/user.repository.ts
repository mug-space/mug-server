import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { UserEntity } from '../entities/user.entity'

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
	async incrementPoint(userId: number, point: number) {
		const user = await this.findOne({ where: { id: userId } })
		if (user) {
			user.point = user.point + point
			await this.save(user)
			return true
		}
		return false
	}

	async decrementPoint(userId: number, point: number) {
		const user = await this.findOne({ where: { id: userId } })
		if (user) {
			user.point = user.point - point
			await this.save(user)
			return true
		}
		return false
	}
}
