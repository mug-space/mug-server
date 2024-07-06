import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

	@Inject()
	private readonly jwtService: JwtService

	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	handleRequest(err: any, user: any, _info: any) {
		if (err || !user) {
			throw err || new UnauthorizedException()
		}
		if (user) {
			return user
		}
		return null
	}
}
