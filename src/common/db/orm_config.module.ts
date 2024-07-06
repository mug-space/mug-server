import {
	Module,
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import TypeOrmConfig from './orm.config'
import { TypeOrmExModule } from './type_orm_ex.module'
import { addTransactionalDataSource } from 'typeorm-transactional'
import { DataSource } from 'typeorm'
import { UserRepository } from 'src/api/repositories/user.repository'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfig,
			dataSourceFactory: async (options) => {
				if (!options) {
					throw new Error('Invalid options passed')
				  }
				  return addTransactionalDataSource(new DataSource(options))
			},
		}),
		TypeOrmExModule.forCustomRepository([
			UserRepository,

		]),
	],
	exports: [ TypeOrmModule, TypeOrmExModule ],
})
export class TypeOrmConfigModule {}
