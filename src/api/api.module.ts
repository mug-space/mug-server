import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthMiddleware } from 'src/common/middleware/auth.middleware'
import { JwtStrategy } from '../common/auth/jwt.strategy'
import { CommonModule } from '../common/common.module'
import { AppController } from './controllers/app.controller'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { AuthController } from './controllers/auth.controller'
import { BillingController } from './controllers/billing.controller'
import { CouponController } from './controllers/coupon.controller'
import { InquiryController } from './controllers/inquiry.controller'
import { PointController } from './controllers/point.controller'
import { YoutubeTimestampController } from './controllers/youtube-timestamp.controller'

const controllers = [ AppController, AuthController, UserController, BillingController, CouponController,
	InquiryController, PointController, YoutubeTimestampController,
]
@Module({
	imports: [ CommonModule ],
	controllers: [ ...controllers ],
	providers: [
		UserService, JwtStrategy,
	],
	exports: [],
})
export class ApiModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(...controllers)
	}
}
