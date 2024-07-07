import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserModel } from 'src/api/dtos/models/user.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

	constructor(private readonly configService: ConfigService) {
		super({
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET') || 'mugspace',
			jwtFromRequest: ExtractJwt.fromExtractors([ (request: Request) => {
				const data = request?.cookies['auth']
				if (!data) {
					return null
				}
				return data.token
			} ]),
		})
	}

	async validate(payload: UserModel | null) {
		if (payload === null) {
			throw new UnauthorizedException()
		}
		return payload
	}
}
