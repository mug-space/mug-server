import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [ JwtModule.register({
		global: true,
		secret: 'mugspace',
		signOptions: {
		  expiresIn: '30d',
		},
	  }) ],
	exports: [ JwtModule ],

})
export class AuthModule { }
