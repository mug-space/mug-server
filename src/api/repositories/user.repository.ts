import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { UserEntity } from '../entities/user.entity'

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
}
