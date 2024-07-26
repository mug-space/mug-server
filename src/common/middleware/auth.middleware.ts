import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'
import { Request, Response } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	private readonly logger = new Logger(AuthMiddleware.name)
	@Inject()
	private readonly jwtService: JwtService

	@Inject()
	private readonly configService: ConfigService

	/**
	 * 1일 이내에 만료되는 토큰이면 재발급
	 * @param req
	 * @param res
	 * @param next
	 */
	async use(req: Request, res: Response, next: () => void) {
		if (req.cookies.auth && req.cookies.auth.token) {
			try {
				const verify = await this.jwtService.verifyAsync(req.cookies.auth.token, { secret: 'mugspace' })
				if (verify.exp - dayjs().unix() < 60 * 60 * 24) {
					delete verify.iat
					delete verify.exp
					const jwt = await this.jwtService.signAsync(verify, { secret: 'mugspace', expiresIn: '30d' })
					res.cookie('auth', { token: jwt }, {
						maxAge: 1000 * 60 * 60 * 24 * 30, // 30일
						httpOnly: true,
						secure: true,
						sameSite: 'none',
						domain: this.configService.get('CLIENT_HOST'),
					})
					res.cookie('is_signin', true, {
						maxAge: 1000 * 60 * 60 * 24 * 60, // 30일
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
