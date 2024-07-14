import {
	Module,
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import TypeOrmConfig from './orm.config'
import { TypeOrmExModule } from './type-orm-ex.module'
import { addTransactionalDataSource } from 'typeorm-transactional'
import { DataSource } from 'typeorm'
import { UserRepository } from 'src/api/repositories/user.repository'
import { YoutubeRepository } from 'src/api/repositories/youtube.repository'
import { YoutubeInfoRepository } from 'src/api/repositories/youtube-info.repository'
import { YoutubeTimestampRepository } from 'src/api/repositories/youtube-timestamp.repository'

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
			UserRepository, YoutubeRepository, YoutubeInfoRepository, YoutubeTimestampRepository,

		]),
	],
	exports: [ TypeOrmModule, TypeOrmExModule ],
})
export class TypeOrmConfigModule {}
