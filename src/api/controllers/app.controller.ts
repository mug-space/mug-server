import { Controller, Get } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import dayjs from 'dayjs'
@Controller()
@ApiExcludeController()
export class AppController {

	@Get('time')
	async time() {
		dayjs().locale('ko')
		return {
			date: dayjs().format('YYYY-MM-DD'),
			dayOfWeek: dayjs().format('dddd').slice(0, 1),
			hour: dayjs().format('k'),
		}
	}

	@Get('health')
	healthCheck(): boolean {
		return true
	}

}
