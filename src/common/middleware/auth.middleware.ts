import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	private readonly logger = new Logger(AuthMiddleware.name)
	@Inject()
	private readonly jwtService: JwtService

	@Inject()
	private readonly configService: ConfigService

	/**
	 * 5분 이내에 만료되는 토큰이면 재발급
	 * @param req
	 * @param res
	 * @param next
	 */
	async use(req: any, res: any, next: () => void) {
		if (req.cookies.auth && req.cookies.auth.token) {
			try {
				const verify = await this.jwtService.verifyAsync(req.cookies.auth.token, { secret: 'mugspace' })
				if (verify.exp - dayjs().unix() < 60 * 5) {
					delete verify.iat
					delete verify.exp
					const jwt = await this.jwtService.signAsync(verify, { secret: 'mugspace', expiresIn: '60m' })
					res.cookie('auth', { token: jwt }, {
						maxAge: 1000 * 60 * 60, // 10min
						httpOnly: true,
						secure: true,
						sameSite: 'none',
						domain: this.configService.get('CLIENT_HOST'),
					})
				}
			} catch (e) {
				this.logger.error(e)
			}
		}
		next()
	}
}
