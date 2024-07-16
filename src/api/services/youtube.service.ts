import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { YoutubeRepository } from '../repositories/youtube.repository'
import { YoutubeInfoRepository } from '../repositories/youtube-info.repository'
import { YoutubeTimestampRepository } from '../repositories/youtube-timestamp.repository'
import { YoutubeTranscript } from 'youtube-transcript'
import { plainToInstance } from 'class-transformer'
import { Caption } from '../entities/youtube-info.entity'
import { HttpService } from '@nestjs/axios'
import AWS from '@aws-sdk/client-lambda'
import { TimeStampModel, YoutubeTimestampStatus } from '../entities/youtube-timestamp.entity'
import { YoutubeCaptionModel, YoutubeModel, YoutubeSimpleModel } from '../dtos/models/youtube.model'

@Injectable()
export class YoutubeService {

	@InjectRepository(YoutubeRepository)
	private readonly youtubeRepository: YoutubeRepository
	@InjectRepository(YoutubeInfoRepository)
	private readonly youtubeInfoRepository: YoutubeInfoRepository
	@InjectRepository(YoutubeTimestampRepository)
	private readonly youtubeTimestampRepository: YoutubeTimestampRepository
	@Inject()
	private readonly httpService: HttpService

	async getYoutubeCaptionList(youtubeId: number) {
		const youtubeInfo = await this.youtubeInfoRepository.findOne({
			where: {
				youtubeId,
			},
		})
		if (youtubeInfo) {
			return plainToInstance(YoutubeCaptionModel, youtubeInfo.captions, { excludeExtraneousValues: true })
		}
		return null
	}

	async getYoutubeSimpleList(userId: number) {
		const youtubeList = await this.youtubeRepository.find({
			relations: [ 'youtubeTimestamp' ],
			where: { userId },
			order: { id: 'DESC' },
		})
		return youtubeList.map((youtube) => {
			return plainToInstance(YoutubeSimpleModel, {
				...youtube,
				status: youtube.youtubeTimestamp ? youtube.youtubeTimestamp.status : YoutubeTimestampStatus.ERROR,
			}, { excludeExtraneousValues: true })
		})
	}

	async getYoutubeDetail(userId: number, youtubeId: number) {
		const youtube = await this.youtubeRepository.findOne({
			relations: [ 'youtubeTimestamp' ],
			where: {
				id: youtubeId, userId: userId,
			},
		})
		if (!youtube) {
			return null
		}
		return plainToInstance(YoutubeModel, {
			...youtube,
			status: youtube.youtubeTimestamp ? youtube.youtubeTimestamp.status : YoutubeTimestampStatus.ERROR,
			timestampString: youtube.youtubeTimestamp ? this.makeYoutubeTimestampString(youtube.youtubeTimestamp.timestamps) : '',
		}, { excludeExtraneousValues: true })
	}

	async checkUsableYoutube(url: string, userId: number) {
		const response = await this.httpService.get(url).toPromise()
		if (response && response.status === 200) {
			const videoId = this.getVideoIdFromUrl(url)
			if (videoId) {
				const captions = await this.getCaption(videoId)
				if (captions && captions.length) {
					const youtubeId = await this.addYoutube(videoId, userId)
					await this.addYoutubeInfo(youtubeId, captions)
					return youtubeId
				}
			}
		}
		return null
	}

	async addYoutubeInfo(youtubeId: number, captions: Caption[]) {
		const youtubeInfo = await this.youtubeInfoRepository.findOne({ where: { youtubeId } })
		if (!youtubeInfo) {
			const newYoutubeInfo = this.youtubeInfoRepository.create({ youtubeId: youtubeId, captions: captions })
			await this.youtubeInfoRepository.save(newYoutubeInfo)
		}

	}

	async addYoutube(videoId: string, userId: number) {
		const youtube = await this.youtubeRepository.findOne({ where: { videoId, userId } })
		if (!youtube) {
			const newYoutube = this.youtubeRepository.create({ videoId, userId })
			await this.youtubeRepository.save(newYoutube)
			return newYoutube.id
		}
		return youtube.id
	}

	async addYoutubeTimestamp(youtubeId: number) {
		const youtubeTimestamp = this.youtubeTimestampRepository.create({ youtubeId })
		await this.youtubeTimestampRepository.save(youtubeTimestamp)
		return youtubeTimestamp.id
	}

	async modifyYoutubeTimestampStatus(youtubeId: number, youtubeTimestampId: number, status: YoutubeTimestampStatus) {
		const timestamp = await this.youtubeTimestampRepository.findOne({ where: {
			id: youtubeTimestampId, youtubeId,
		} })
		if (timestamp) {
			timestamp.status = status
			await this.youtubeTimestampRepository.save(timestamp)
		}
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

		return null
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

	async invokeYoutubeTimestampLambda(youtubeId: number, youtubeTimestampId: number) {
		const lambda = new AWS.Lambda({
			region: 'ap-northeast-2',
		  })
		  const data = {
			youtubeTimestampId, youtubeId,
		  }

		  await lambda.invokeAsync({ FunctionName: 'mug-space-task-prod-main',
			InvokeArgs: JSON.stringify({ target: 'youtube-timestamp',
				data: data }) })
	}

	private makeYoutubeTimestampString(timestamps: TimeStampModel[]) {
		return timestamps.reduce((prev, curr) => {
			prev = prev + `[${curr.time}] ${curr.title}\n`
			return prev
		}, '')
	}
}
