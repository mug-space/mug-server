import { Module } from '@nestjs/common'
import { ApiModule } from 'src/api/api.module'
import { ExceptionModule } from './common/exception/exception.module'

@Module({
	imports: [
		ApiModule, ExceptionModule,
	],

})
export class AppModule { }
