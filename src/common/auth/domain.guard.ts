import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class DomainGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		const host = request.headers.host
		console.log(`Request received from host: ${host}`)

		// 원하는 로직을 추가하여 특정 도메인만 허용하는 등의 작업을 할 수 있습니다.
		if (host === 's.mugspace.io') {
			return true
		} else {
			return false
		}
	}
}
