import { HttpModule } from '@nestjs/axios'
import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { CommonConfigModule } from './config/common-config.module'
import { TypeOrmConfigModule } from './db/orm-config.module'
import { ResponseModule } from './response/response.module'

@Module({
	imports: [ CommonConfigModule, TypeOrmConfigModule, ResponseModule, AuthModule, HttpModule ],
	providers: [
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({ transform: true }),
		},
	],
	exports: [ CommonConfigModule, TypeOrmConfigModule, ResponseModule, AuthModule, HttpModule ],
})
export class CommonModule {}
