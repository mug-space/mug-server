import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'

@Module({
	imports: [ JwtModule.register({
		secret: 'mugspace',
		secretOrPrivateKey: 'mugspace',
		signOptions: {
		  expiresIn: '60m',
		},
	  }) ],
	providers: [ JwtService ],
	exports: [ JwtModule, JwtService ],

})
export class AuthModule { }
