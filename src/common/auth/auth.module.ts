import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [ JwtModule.register({
		secret: 'mugspace',
		secretOrPrivateKey: 'mugspace',
		signOptions: {
		  expiresIn: '60m',
		},
	  }) ],
	providers: [ ],
	exports: [ JwtModule ],

})
export class AuthModule { }
