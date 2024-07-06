import {
	Module,
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import TypeOrmConfig from './orm.config'
import { TypeOrmExModule } from './type_orm_ex.module'
import { addTransactionalDataSource } from 'typeorm-transactional'
import { DataSource } from 'typeorm'

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

		]),
	],
	exports: [ TypeOrmModule, TypeOrmExModule ],
})
export class TypeOrmConfigModule {}
