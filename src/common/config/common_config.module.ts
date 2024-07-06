import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './configuration'
import development from './development'
import local from './local'
import production from './production'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [ configuration, process.env.NODE_ENV === 'production' ? production :
				process.env.NODE_ENV === 'development' ? development : local ],
	  }),
	],
	providers: [ ConfigService ],
	exports: [ ConfigModule ],
})
export class CommonConfigModule {}
