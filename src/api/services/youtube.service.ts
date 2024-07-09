import { Injectable } from '@nestjs/common'

@Injectable()
export class YoutubeService {
	getVideoIdFromUrl(url: string) {
		/**
		 * YouTube URL regex.
		 *
		 * Patterns:
		 *   https://www.youtube.com/watch?v=<ID>
		 *   https://www.youtube.com/watch?v=<ID>&feature=youtu.be
		 *   https://youtu.be/<ID>
		 *   https://youtu.be/<ID>?t=1s
		 */
		const regex = /(youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/
		if (typeof url !== 'string') {
			throw new TypeError('First argument must be a string')
		}

		const match = url.match(regex)

		if (match?.length && match[2]) {
			return match[2]
		}

		return url
	}
}
