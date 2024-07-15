import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthMiddleware } from 'src/common/middleware/auth.middleware'
import { JwtStrategy } from '../common/auth/jwt.strategy'
import { CommonModule } from '../common/common.module'
import { AppController } from './controllers/app.controller'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { AuthController } from './controllers/auth.controller'
import { PaymentController } from './controllers/payment.controller'
import { CouponController } from './controllers/coupon.controller'
import { InquiryController } from './controllers/inquiry.controller'
import { PointController } from './controllers/point.controller'
import { YoutubeController } from './controllers/youtube.controller'
import { YoutubeService } from './services/youtube.service'
import { PaymentService } from './services/payment.service'
import { CouponService } from './services/coupon.service'
import { ProductController } from './controllers/product.controller'
import { ProductService } from './services/product.service'
import { PointService } from './services/point.service'
import { InquiryService } from './services/inquiry.service'

const controllers = [ AppController, AuthController, UserController, PaymentController, CouponController,
	InquiryController, PointController, YoutubeController, ProductController,
]
@Module({
	imports: [ CommonModule ],
	controllers: [ ...controllers ],
	providers: [
		JwtStrategy, UserService, YoutubeService, PaymentService, CouponService,
		ProductService, PointService, InquiryService,
	],
	exports: [],
})
export class ApiModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(...controllers)
	}
}
