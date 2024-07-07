import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthMiddleware } from 'src/common/middleware/auth.middleware'
import { JwtStrategy } from '../common/auth/jwt.strategy'
import { CommonModule } from '../common/common.module'
import { AppController } from './controllers/app.controller'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { JwtService } from '@nestjs/jwt'

const controllers = [ AppController, UserController ]
@Module({
	imports: [ CommonModule ],
	controllers: [ ...controllers ],
	providers: [
		UserService, JwtStrategy,
		JwtService,
	],
	exports: [],
})
export class ApiModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(...controllers)
	}
}