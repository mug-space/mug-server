import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { YoutubeRepository } from '../repositories/youtube.repository'
import { YoutubeInfoRepository } from '../repositories/youtube-info.repository'
import { YoutubeTimestampRepository } from '../repositories/youtube-timestamp.repository'
import { YoutubeTranscript } from 'youtube-transcript'
import { plainToInstance } from 'class-transformer'
import { Caption } from '../entities/youtube-info.entity'
import { HttpService } from '@nestjs/axios'
import { Lambda } from '@aws-sdk/client-lambda'
import { TimeStampModel, YoutubeTimestampStatus } from '../entities/youtube-timestamp.entity'
import { YoutubeCaptionModel, YoutubeModel, YoutubeSimpleModel, YoutubeTimestampModel } from '../dtos/models/youtube.model'
import { ConfigService } from '@nestjs/config'

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
	@Inject()
	private readonly configService: ConfigService

	async getYoutubeCaptionList(youtubeId: number) {
		const youtubeInfo = await this.youtubeInfoRepository.findOne({
			where: {
				youtubeId,
			},
		})

		if (youtubeInfo) {
			const lang = youtubeInfo.captions[0].lang || 'ko'
			return {
				captions: plainToInstance(YoutubeCaptionModel, youtubeInfo.captions, { excludeExtraneousValues: true }),
				lang,
			}
		}
		return null
	}

	async getYoutubeSimpleList(userId: number) {
		const youtubeList = await this.youtubeRepository.find({
			relations: [ 'youtubeTimestamps' ],
			where: { userId },
			order: { id: 'DESC' },
		})
		return youtubeList.map((youtube) => {
			const isCompleted = youtube.youtubeTimestamps.every((timestamp) => timestamp.status === YoutubeTimestampStatus.COMPLETED)
			return plainToInstance(YoutubeSimpleModel, {
				...youtube,
				status: isCompleted ? YoutubeTimestampStatus.COMPLETED : YoutubeTimestampStatus.NOT_COMPLETED,
			}, { excludeExtraneousValues: true })
		})
	}

	async getYoutubeDetail(userId: number, youtubeId: number) {
		const youtube = await this.youtubeRepository.findOne({
			relations: [ 'youtubeTimestamps' ],
			where: {
				id: youtubeId, userId: userId,
			},
		})
		if (!youtube) {
			return null
		}
		const isCompleted = youtube.youtubeTimestamps.length === 2
			&& youtube.youtubeTimestamps.every((timestamp) => timestamp.status === YoutubeTimestampStatus.COMPLETED)
		return plainToInstance(YoutubeModel, {
			...youtube,
			status: isCompleted ? YoutubeTimestampStatus.COMPLETED : YoutubeTimestampStatus.NOT_COMPLETED,
			firstTimestamp: isCompleted ? this.makeYoutubeTimestampString(youtube.youtubeTimestamps[0].timestamps) : null,
			secondTimestamp: isCompleted ? this.makeYoutubeTimestampString(youtube.youtubeTimestamps[1].timestamps) : null,
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
					const youtubeInfo = await this.addYoutubeInfo(youtubeId, captions, videoId)
					return { youtubeId, point: youtubeInfo.timestampPoint }
				}
			}
		}
		return null
	}

	async addYoutubeInfo(youtubeId: number, captions: Caption[], videoId: string) {
		// const youtubeInfo = await this.youtubeInfoRepository.findOne({ where: { youtubeId } })
		// if (!youtubeInfo) {

		// }
		const rapidInfo = await this.getYoutubeDetailFromRapidAPI(videoId)
		const point = rapidInfo ? this.getPoint(Number(rapidInfo.video_length)) : this.getPoint(this.getLastTime(captions))
		const newYoutubeInfo = this.youtubeInfoRepository.create({ youtubeId: youtubeId, captions: captions, timestampPoint: point })
		return await this.youtubeInfoRepository.save(newYoutubeInfo)

	}

	private getLastTime(captions: Caption[]) {
		const lastCaption = captions[captions.length - 1]
		return Math.floor(lastCaption.offset + lastCaption.duration)
	}

	private getPoint(videoTime: number) {
		const minute = Math.floor(videoTime / 60)
		if (minute < 10) {
			return 200
		} else if (minute < 20) {
			return 400
		} else if (minute < 30) {
			return 600
		} else {
			return 800
		}
	}

	async addYoutube(videoId: string, userId: number) {
		// const youtube = await this.youtubeRepository.findOne({ where: { videoId, userId } })
		// if (!youtube) {

		// }
		// return youtube.id

		const newYoutube = this.youtubeRepository.create({ videoId, userId })
		await this.youtubeRepository.save(newYoutube)
		return newYoutube.id
	}

	async existYoutubeTimestamp(youtubeId: number) {
		return await this.youtubeTimestampRepository.exists({
			where: {
				youtubeId,
			},
		})
	}

	async getYoutubeTimestampPoint(youtubeId: number) {
		const info = await this.youtubeInfoRepository.findOne({ where: {
			youtubeId,
		} })
		if (info) {
			return info.timestampPoint
		}
		return null
	}

	async addYoutubeTimestamp(youtubeId: number) {
		const youtubeTimestamp = this.youtubeTimestampRepository.create({ youtubeId, timestamps: [] })
		await this.youtubeTimestampRepository.save(youtubeTimestamp)
		return youtubeTimestamp.id
	}

	async getYoutube(youtubeId: number) {
		return this.youtubeRepository.findOne({ where: { id: youtubeId } })
	}

	async modifyYoutubeTimestampStatus(youtubeId: number, youtubeTimestampId: number, status: YoutubeTimestampStatus) {
		const timestamp = await this.youtubeTimestampRepository.findOne({ where: {
			youtubeId, id: youtubeTimestampId,
		},
		relations: [ 'youtube', 'youtube.youtubeInfo' ],
		},

		)
		if (timestamp) {
			timestamp.status = status
			await this.youtubeTimestampRepository.save(timestamp)
			return timestamp
		}
		return null
	}

	async modifyYoutubeTimestampList(youtubeId: number, youtubeTimestampId: number, timestamps: YoutubeTimestampModel[]) {
		const youtubeTimestamp = await this.youtubeTimestampRepository.findOne({ where: {
			youtubeId, id: youtubeTimestampId,
		} })
		if (youtubeTimestamp) {
			youtubeTimestamp.timestamps = timestamps
			await this.youtubeTimestampRepository.save(youtubeTimestamp)
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

	async invokeYoutubeTimestampLambda(youtubeId: number, youtubeTimestampId: number, generateType: string) {

		if (this.configService.get('NODE_ENV') === 'local') {
			await this.httpService.post('http://localhost:8001/generate-timestamp', { youtubeId }).toPromise()
		} else {
			const lambda = new Lambda({
				region: 'ap-northeast-2',
			  })
			  const data = {
				youtubeId, youtubeTimestampId, generateType,
			  }

			  await lambda.invokeAsync({ FunctionName: 'mug-space-task-prod-main',
				InvokeArgs: JSON.stringify({ target: 'youtube-timestamp',
					data: data }) })
		}

	}

	async invokeYoutubeTimestampByCaptionsLambda(captions: YoutubeCaptionModel[]) {

		if (this.configService.get('NODE_ENV') === 'local') {
			const result = await this.httpService.post('http://localhost:8001/generate-timestamp-by-captions', { captions }).toPromise()
			if (result && result.data) {
				return plainToInstance(YoutubeTimestampModel, result.data, { excludeExtraneousValues: true })
			} else {
				return null
			}
		} else {
			const lambda = new Lambda({
				region: 'ap-northeast-2',
			})

			const resultLambda = await lambda.invoke(
				{ FunctionName: 'mug-space-task-prod-main',
					Payload: JSON.stringify({ target: 'youtube-timestamp-by-captions', data: { captions } }) }
			)
			if (resultLambda.Payload) {
				return plainToInstance(YoutubeTimestampModel,
					JSON.parse(resultLambda.Payload.toString()), { excludeExtraneousValues: true })
			}
			return null
		}

	}

	private makeYoutubeTimestampString(timestamps: TimeStampModel[]) {
		return timestamps.reduce((prev, curr) => {
			prev = prev + `${curr.time} ${curr.title}\n`
			return prev
		}, '')
	}

	private async getYoutubeDetailFromRapidAPI(videoId: string) {

		const options = {
			method: 'GET',
			url: 'https://youtube-v2.p.rapidapi.com/video/details',
			params: {
			  video_id: videoId,
			},
			headers: {
			  'x-rapidapi-key': '2817c39907msh6724e064079b7a2p186d24jsn076d1c7e2627',
			  'x-rapidapi-host': 'youtube-v2.p.rapidapi.com',
			},
		  }

		  try {
			  const response = await this.httpService.request<RapidVideoDetail>(options).toPromise()
			  if (response) {
				return response.data
			  }
			  return null

		  } catch (error) {
			  console.error(error)
			  return null
		  }
	}
}

interface RapidVideoThumbnail {
	url: string;
	width: number;
	height: number;
}

export class RapidVideoDetail {
	video_id: string
	title: string
	author: string
	number_of_views: number
	video_length: string
	description: string
	is_live_content: string
	published_time: string
	channel_id: string
	category: string
	type: string = 'NORMAL'
	keywords: string[]
	thumbnails: RapidVideoThumbnail[]

}
