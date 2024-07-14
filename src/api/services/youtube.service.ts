import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { YoutubeRepository } from '../repositories/youtube.repository'
import { YoutubeInfoRepository } from '../repositories/youtube-info.repository'
import { YoutubeTimestampRepository } from '../repositories/youtube-timestamp.repository'
import { YoutubeTranscript } from 'youtube-transcript'
import { instanceToInstance, plainToInstance } from 'class-transformer'
import { Caption } from '../entities/youtube-info.entity'

@Injectable()
export class YoutubeService {

	@InjectRepository(YoutubeRepository)
	private readonly youtubeRepository: YoutubeRepository
	@InjectRepository(YoutubeInfoRepository)
	private readonly youtubeInfoRepository: YoutubeInfoRepository
	@InjectRepository(YoutubeTimestampRepository)
	private readonly youtubeTimestampRepository: YoutubeTimestampRepository

	async checkUsableYoutube(url: string) {
		const videoId = this.getVideoIdFromUrl(url)
		const captions = await this.getCaption(videoId)
		if (captions) {

		}
	}

	async addYoutubeInfo() {

	}

	async addYoutube(videoId: string, userId: number) {

	}

	async addYoutubeTimestamp() {

	}

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

	async getCaption(videoId: string) {
		try {
			const transcriptResponse = await YoutubeTranscript.fetchTranscript(videoId)
			return plainToInstance(Caption, transcriptResponse)
		} catch (error) {
			console.error(error)
			return null
		}

	}
}
