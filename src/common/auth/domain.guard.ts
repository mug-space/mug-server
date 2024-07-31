import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class DomainGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		const allowedDomain = 'https://s.mug-space.io'
		const origin = request.headers.origin || ''

		return origin.includes(allowedDomain)
	}
}
