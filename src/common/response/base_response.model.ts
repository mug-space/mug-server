import { ApiProperty } from '@nestjs/swagger'
import { Builder } from 'builder-pattern'

export class BaseResponse {
	static readonly builder = () => Builder(this)
	@ApiProperty()
	public status: string = 'success'

	public constructor(
		public readonly data: unknown,
	) { }
}

export class ErrorResponse extends BaseResponse {
	@ApiProperty({ enum: [ 'error' ] })
	public readonly status: string = 'error'

	@ApiProperty({ type: String })
	public error: string | null = null

	@ApiProperty({ type: String })
	public message: string | null = null

	@ApiProperty({ type: String })
	public readonly url: string

	@ApiProperty({ type: String })
	public readonly method: string

	@ApiProperty({ type: String })
	public readonly timestamp = Date.now()

	public constructor(url: string, method: string) {
		super(null)
		this.url = url
		this.method = method
	}
}
