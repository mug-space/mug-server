import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthMiddleware } from 'src/common/middleware/auth.middleware'
import { JwtStrategy } from '../common/auth/jwt.strategy'
import { KakaoStrategy } from '../common/auth/kakao.strategy'
import { CommonModule } from '../common/common.module'
import { AppController } from './controllers/app.controller'
import { AuthController } from './controllers/auth.controller'
import { BatchController } from './controllers/batch.controller'
import { LogController } from './controllers/log.controller'
import { OrderController } from './controllers/order.controller'
import { PaymentController } from './controllers/payment.controller'
import { PhoneController } from './controllers/phone.controller'
import { PhoneTimeController } from './controllers/phone_time.controller'
import { QRCodeController } from './controllers/qrcode.controller'
import { UserController } from './controllers/user.controller'
import { CallmixService } from './services/callmix.service'
import { LogService } from './services/log.service'
import { OrderService } from './services/order.service'
import { PaymentService } from './services/payment.service'
import { PhoneService } from './services/phone.service'
import { PhoneTimeService } from './services/phone_time.service'
import { QRCodeService } from './services/qrcode.service'
import { UserService } from './services/user.service'
import { VirtualPhoneService } from './services/virtual_phone.service'
import { JwtService } from '@nestjs/jwt'
import { AdminOrderController } from './controllers/admin/admin.order.controller'
import { FileController } from './controllers/file.controller'
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data'
import { FileService } from './services/file.service'
import { QRCodeMappedEventHandler } from './listener/qrcode_mapped_event.handler'
import { SubscriptionController } from './controllers/subscription.controller'
import { SubscriptionService } from './services/subscription.service'

const controllers = [ AppController, AuthController, PhoneTimeController, PhoneController, QRCodeController,
	LogController, PaymentController, BatchController, UserController, OrderController, FileController, SubscriptionController ]
@Module({
	imports: [ CommonModule, NestjsFormDataModule.config({ storage: MemoryStoredFile }) ],
	controllers: [ ...controllers, AdminOrderController ],
	providers: [
		UserService, KakaoStrategy, JwtStrategy, QRCodeService, PhoneService, CallmixService, LogService,
		PhoneTimeService, PaymentService, VirtualPhoneService, OrderService, JwtService, FileService, QRCodeMappedEventHandler,
		SubscriptionService ],
	exports: [],
})
export class ApiModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(...controllers)
	}
}
