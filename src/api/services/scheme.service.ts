import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SchemeRepository } from '../repositories/scheme.repository'
import { SchemeExpireType, SchemeModel, SchemeOGData, SchemeType, SchemeUsableType } from '../dtos/models/scheme.model'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import { IsNull } from 'typeorm'
import { SchemeEntity } from '../entities/scheme.entity'
import ogs from 'open-graph-scraper'
import _ from 'lodash'

export enum UserAgentDevice {
	Android = 'Android',
	iOS = 'iOS',
	Windows = 'Windows',
	macOS = 'macOS',
	Unknown = 'Unknown',
}

// Channel: (https://youtube.com/@ytbeoneapp)
// Channel: (https://youtube.com/c/ytbeoneapp)
// Video: (https://youtube.com/watch?v=3xvxLBvdnKo)
// Short Video: (https://youtube.com/shorts/cS7s7t9JG3I)
// Live Video: (https://youtube.com/live/3xvxLBvdnKo)
// Video: (https://youtu.be/3xvxLBvdnKo)
const videoPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/
const shortPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/
const livePattern = /^(https?:\/\/)?(www\.)?youtube\.com\/live\/[\w-]+/
const youtuPattern = /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/
const channelPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/(@[\w\p{L}-]+|channel\/[\w-]+)/u
const igProfilePattern = /^(https?:\/\/)?(www\.)?instagram\.com\/([\w\p{L}-]+)/
const igPostPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/p\/([\w-]+)/
const fbProfilePattern1 = /facebook\.com\/profile\.php\?id=([\w-]+)/
const fbProfilePattern2 = /facebook\.com\/([\w.]+)/
const fbPostPattern = /facebook\.com\/.*\/posts\/([\w-]+)/

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'

@Injectable()
export class SchemeService {

	@InjectRepository(SchemeRepository)
	private readonly schemeRepository: SchemeRepository

	async getSchemeByPathAndType(path: string, type: SchemeType) {
		const scheme = await this.schemeRepository.findOne({
			where: { path, type },
		})
		return scheme
	}

	detectDevice(userAgent: string | undefined): UserAgentDevice {
		if (!userAgent) return UserAgentDevice.Unknown
		if (userAgent.includes('Android')) {
			return UserAgentDevice.Android
		} else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
			return UserAgentDevice.iOS
		} else if (userAgent.includes('Windows')) {
			return UserAgentDevice.Windows
		} else if (userAgent.includes('Macintosh')) {
			return UserAgentDevice.macOS
		} else {
			return UserAgentDevice.Unknown
		}
	}

	async addScheme(url: string, type: SchemeType, path: string, userId: number, expireType: SchemeExpireType) {
		let og = null
		try {
			const ogsResult = await ogs({ url, fetchOptions: { headers: { 'user-agent': userAgent } } })
			if (ogsResult && !ogsResult.error && ogsResult.result.success) {
				og = new SchemeOGData()
				og.title = ogsResult.result.ogTitle || null
				og.description = ogsResult.result.ogDescription || null
				og.image = ogsResult.result.ogImage && ogsResult.result.ogImage.length ? ogsResult.result.ogImage[0].url || null : null
			}
		} catch (error) {
			console.error(error)
		}

		const expiredAt = expireType === SchemeExpireType.ONE_MONTH ? dayjs().add(1, 'months') : dayjs().add(6, 'months')
		const scheme = this.schemeRepository.create({
			path, url, userId, type, expireType, expiredAt: expiredAt.valueOf(), og,
		})
		await this.schemeRepository.save(scheme)
		return this.definedSchemeModel(scheme)
	}

	private makeCusotmUrl(type: SchemeType, path: string) {
		switch (type) {
			case SchemeType.YOUTUBE_CHANNEL:
				return `https://s.mug-space.io/yt/c/${path}`
			case SchemeType.YOUTUBE_VIDEO:
				return `https://s.mug-space.io/yt/v/${path}`
			case SchemeType.INSTAGRAM_PROFILE:
				return `https://s.mug-space.io/ig/u/${path}`
			case SchemeType.INSTAGRAM_POST:
				return `https://s.mug-space.io/ig/p/${path}`
			case SchemeType.FACEBOOK_PROFILE:
				return `https://s.mug-space.io/fb/u/${path}`
			case SchemeType.FACEBOOK_POST:
				return `https://s.mug-space.io/fb/p/${path}`
			default:
				return ''
		}
	}

	async updateSchemeExpiredAt(id: number, expireType: SchemeExpireType) {
		const addMonth = expireType === SchemeExpireType.ONE_MONTH ? 1 : 6
		const scheme = await this.schemeRepository.findOne({ where: {
			id,
		} })
		if (scheme) {
			if (dayjs(scheme.expiredAt).isBefore()) {
				scheme.expiredAt = dayjs().add(addMonth, 'months').valueOf()
			} else {
				scheme.expiredAt = dayjs(scheme.expiredAt).add(addMonth, 'months').valueOf()
			}
			await this.schemeRepository.save(scheme)
			return this.definedSchemeModel(scheme)
		}
		return null
	}

	async updateScheme(id: number, url: string, userId: number) {
		const scheme = await this.schemeRepository.findOne({ where: {
			id,
		} })
		if (scheme) {
			if (scheme.userId === userId) {
				scheme.url = url
				await this.schemeRepository.save(scheme)
				return this.definedSchemeModel(scheme)

			}
		}
		return null
	}

	async getSchemeList(userId: number) {
		const list = await this.schemeRepository.find({ where: {
			userId,
		} })
		return list.map((scheme) => {
			return this.definedSchemeModel(scheme)
		})

	}

	private definedSchemeModel(scheme: SchemeEntity) {
		return plainToInstance(SchemeModel, {
			...scheme,
			customUrl: this.makeCusotmUrl(scheme.type, scheme.path),
			usableType: this.getUsableType(scheme.expiredAt),
		}, { excludeExtraneousValues: true })
	}

	async getSchemeDetail(id: number, userId: number) {
		const scheme = await this.schemeRepository.findOne({
			where: {
				id, userId,
			},
		})
		if (scheme) {
			return plainToInstance(SchemeModel, {
				...scheme,
				customUrl: this.makeCusotmUrl(scheme.type, scheme.path),
				usableType: this.getUsableType(scheme.expiredAt),
			}, { excludeExtraneousValues: true })
		}
		return null
	}

	makeYoutubeAndroidSchemeUrl(url: string) {
		if (url.includes('youtube.com')) {
			return `intent://${url.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.youtube;scheme=https;end;`
		} else if (url.includes('youtu.be')) {
			return `intent://${url.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.youtube;scheme=https;end;`
		} else {
			return url
		}
	}

	getUsableType(expiredAt: number) {
		const expired = dayjs().isAfter(expiredAt)
		return expired ? SchemeUsableType.EXPIRED : SchemeUsableType.POSSIBLE
	}

	makeYoutubeIOSSchemeUrl(url: string) {
		return `youtube://${url.replace('https://', '')}`
	}

	getTypeByUrl(url: string) {
		if (channelPattern.test(url)) {
			return SchemeType.YOUTUBE_CHANNEL
		} else if (videoPattern.test(url)) {
			return SchemeType.YOUTUBE_VIDEO
		} else if (igProfilePattern.test(url)) {
			return SchemeType.INSTAGRAM_PROFILE
		} else if (igPostPattern.test(url)) {
			return SchemeType.INSTAGRAM_POST
		} else if (fbProfilePattern1.test(url) || (fbProfilePattern2.test(url)) && !fbPostPattern.test(url)) {
			return SchemeType.FACEBOOK_PROFILE
		} else if (fbPostPattern.test(url)) {
			return SchemeType.FACEBOOK_POST
		}
		return null

	}

	validPath(path: string) {
		const regex = /^[a-z0-9-_]{1,10}$/
		return regex.test(path)
	}

	validUrl(type: SchemeType, url: string) {
		if (type === SchemeType.YOUTUBE_CHANNEL) {
			return channelPattern.test(url)
		} else if (type === SchemeType.YOUTUBE_VIDEO) {
			return (videoPattern.test(url) || shortPattern.test(url) || livePattern.test(url) || youtuPattern.test(url))
		} else if (type === SchemeType.INSTAGRAM_PROFILE) {
			return igProfilePattern.test(url)
		} else if (type === SchemeType.INSTAGRAM_POST) {
			return igPostPattern.test(url)
		} else if (type === SchemeType.FACEBOOK_PROFILE) {
			return fbProfilePattern1.test(url) || (fbProfilePattern2.test(url)) && !fbPostPattern.test(url)
		} else if (type === SchemeType.FACEBOOK_POST) {
			return fbPostPattern.test(url)
		}
		return false
	}

	async existPath(path: string) {
		return await this.schemeRepository.exists({ where: {
			path, deletedAt: IsNull(),
		} })
	}

	getPointByType(type: SchemeType, expiredType: SchemeExpireType) {
		const points = this.getSchemePointsByType(type)
		const point = points.find((point) => point.expireType === expiredType)
		return point ? point.point : 0
	}

	makeInstagramProfileUrl(url: string): UrlTypeResult {
		if (igProfilePattern.test(url)) {
			const matches = url.match(igProfilePattern)
			const username = matches ? matches[3] : ''
			return {
				webUrl: `https://www.instagram.com/${username}`,
				mobileUrl: `instagram://user?username=${username}`,
			}
		} else {
			return {
				webUrl: url,
				mobileUrl: url,
			}
		}
	}

	makeInstagramPostUrls(url: string): UrlTypeResult {
		if (igPostPattern.test(url)) {
			const matches = url.match(igPostPattern)
			const postId = matches ? matches[3] : ''
			return {
				webUrl: `https://www.instagram.com/p/${postId}`,
				mobileUrl: `instagram://media?id=${postId}`,
			}
		} else {
			return {
				webUrl: url,
				mobileUrl: url,
			}
		}
	}

	makeFacebookProfileUrls(baseUrl: string): UrlTypeResult {
		if (fbProfilePattern1.test(baseUrl)) {
			const profileId = baseUrl.match(fbProfilePattern1)?.[1]
			return {
				webUrl: `https://www.facebook.com/profile.php?id=${profileId}`,
				mobileUrl: `fb://profile/${profileId}`,
			}
		} else if (fbProfilePattern2.test(baseUrl) && !fbPostPattern.test(baseUrl)) {
			const username = baseUrl.match(fbProfilePattern2)?.[1]
			return {
				webUrl: `https://www.facebook.com/${username}`,
				mobileUrl: `fb://profile/${username}`,
			}
		} else {
			return {
				webUrl: baseUrl, mobileUrl: baseUrl,
			}
		}
	}

	makeFacebookPostUrls(baseUrl: string): UrlTypeResult {
		if (fbPostPattern.test(baseUrl)) {
			const postId = baseUrl.match(fbPostPattern)?.[1]
			return {
				webUrl: `https://www.facebook.com/${postId}`,
				mobileUrl: `fb://post/${postId}`,
			}
		} else {
			return {
				webUrl: baseUrl, mobileUrl: baseUrl,
			}
		}
	}

	makeYoutubeResponseHtml(redirectUrl: string, webUrl: string, og: SchemeOGData | null) {
		let meta = ''
		if (og) {
			if (og.title) {
				meta += `<meta property="og:title" content="${og.title}" >`
			}
			if (og.description) {
				meta += `<meta property="og:description" content="${og.description}" >`
			}
			if (og.image) {
				meta += `<meta property="og:image" content="${og.image}" >`
			}
		}

		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta property="og:url" content="${webUrl}" >
					${meta}
					<title>Redirect to YouTube App</title>
					<style>
						body {
							background-color: black;
							color: white;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
							margin: 0;
							font-family: Arial, sans-serif;
						}
					</style>
					<script>
					function redirectToYouTubeApp() {
						// Custom URL Scheme
						const youtubeAppURL = '${redirectUrl}';

						// Attempt to open the YouTube app
						window.location = youtubeAppURL;

						// Fallback to the YouTube web page after a delay
						setTimeout(function() {
						window.location = '${webUrl}';
						}, 2000); // 2 seconds delay
					}

					window.onload = redirectToYouTubeApp;
					</script>
				</head>
				<body>
					<div>Redirecting to YouTube...</div>
				</body>
				</html>
				`
	}

	makeInstagramResponseHtml(redirectUrl: string, webUrl: string, og: SchemeOGData | null) {
		let meta = ''
		if (og) {
			if (og.title) {
				meta += `<meta property="og:title" content="${og.title}" >`
			}
			if (og.description) {
				meta += `<meta property="og:description" content="${og.description}" >`
			}
			if (og.image) {
				meta += `<meta property="og:image" content="${og.image}" >`
			}
		}
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta property="og:url" content="${webUrl}" >
					${meta}
					<title>Redirect to Instagram App</title>
					<style>
						body {
							background-color: black;
							color: white;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
							margin: 0;
							font-family: Arial, sans-serif;
						}
					</style>
					<script>
					function redirectToYouTubeApp() {
						// Custom URL Scheme
						const youtubeAppURL = '${redirectUrl}';

						// Attempt to open the YouTube app
						window.location = youtubeAppURL;

						// Fallback to the YouTube web page after a delay
						setTimeout(function() {
						window.location = '${webUrl}';
						}, 2000); // 2 seconds delay
					}

					window.onload = redirectToYouTubeApp;
					</script>
				</head>
				<body>
					<div>Redirecting to Instagram...</div>
				</body>
				</html>
				`
	}

	makeFacebookResponseHtml(redirectUrl: string, webUrl: string, og: SchemeOGData | null) {

		let meta = ''
		if (og) {
			if (og.title) {
				meta += `<meta property="og:title" content="${og.title}" >`
			}
			if (og.description) {
				meta += `<meta property="og:description" content="${og.description}" >`
			}
			if (og.image) {
				meta += `<meta property="og:image" content="${og.image}" >`
			}
		}
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta property="og:url" content="${webUrl}" >
					${meta}
					<title>Redirect to Facebook App</title>
					<style>
						body {
							background-color: black;
							color: white;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
							margin: 0;
							font-family: Arial, sans-serif;
						}
					</style>
					<script>
					function redirectToYouTubeApp() {
						// Custom URL Scheme
						const youtubeAppURL = '${redirectUrl}';

						// Attempt to open the YouTube app
						window.location = youtubeAppURL;

						// Fallback to the YouTube web page after a delay
						setTimeout(function() {
						window.location = '${webUrl}';
						}, 2000); // 2 seconds delay
					}

					window.onload = redirectToYouTubeApp;
					</script>
				</head>
				<body>
					<div>Redirecting to Facebook...</div>
				</body>
				</html>
				`
	}

	getSchemePointsByType(type: SchemeType) {
		const points = this.getSchemePoints()
		return points.filter((point) => point.type === type)
	}

	getSchemeDefaultPoints() {
		return [
			{
				type: SchemeType.YOUTUBE_CHANNEL,
				point: 500,
			},
			{
				type: SchemeType.YOUTUBE_VIDEO,
				point: 200,
			},
			{
				type: SchemeType.INSTAGRAM_PROFILE,
				point: 500,
			},
			{
				type: SchemeType.INSTAGRAM_POST,
				point: 200,
			},
			{
				type: SchemeType.FACEBOOK_PROFILE,
				point: 500,
			},
			{
				type: SchemeType.FACEBOOK_POST,
				point: 200,
			},
		]
	}

	calculatorPoint(type: SchemeExpireType, defaultPoint: number) {
		switch (type) {
			case SchemeExpireType.ONE_MONTH:
				return defaultPoint
			case SchemeExpireType.THREE_MONTH:
				return defaultPoint * 1.5
			case SchemeExpireType.SIX_MONTH:
				return defaultPoint * 2
			case SchemeExpireType.TWELVE_MONTH:
				return defaultPoint * 3.5
			default:
				return defaultPoint
		}
	}

	getSchemePoints() {
		const defaultPoints = this.getSchemeDefaultPoints()
		const totalPoints = []
		for (const expireType of _.values(SchemeExpireType)) {
			for (const defaultPoint of defaultPoints) {
				totalPoints.push(
					{
						expireType: expireType,
						type: defaultPoint.type,
						point: this.calculatorPoint(expireType, defaultPoint.point),
					},
				)
			}
		}
		return totalPoints
	}

}

interface UrlTypeResult {
	webUrl: string;
	mobileUrl: string;
}
