import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SchemeRepository } from '../repositories/scheme.repository'
import { SchemeExpireType, SchemeModel, SchemeType, SchemeUsableType } from '../dtos/models/scheme.model'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import { IsNull } from 'typeorm'
import { SchemeEntity } from '../entities/scheme.entity'
import ogs from 'open-graph-scraper'

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
const fbProfilePattern = /facebook\.com\/profile\.php\?id=([\w-]+)/
const fbPostPattern = /facebook\.com\/.*\/posts\/([\w-]+)/

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
		const expiredAt = expireType === SchemeExpireType.ONE_MONTH ? dayjs().add(1, 'months') : dayjs().add(6, 'months')
		const scheme = this.schemeRepository.create({
			path, url, userId, type, expireType, expiredAt: expiredAt.valueOf(),
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
				scheme.expiredAt = dayjs(scheme.expiredAt).add(addMonth).valueOf()
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
			return fbProfilePattern.test(url)
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
		if (expiredType === SchemeExpireType.ONE_MONTH) {
			switch (type) {
				case SchemeType.YOUTUBE_CHANNEL:
				case SchemeType.FACEBOOK_PROFILE:
				case SchemeType.INSTAGRAM_PROFILE:
					return 500
				default:
					return 200
			}

		} else if (expiredType === SchemeExpireType.SIX_MONTH) {
			switch (type) {
				case SchemeType.YOUTUBE_CHANNEL:
				case SchemeType.FACEBOOK_PROFILE:
				case SchemeType.INSTAGRAM_PROFILE:
					return 1000
				default:
					return 400
			}
		}
		return 0
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
		if (fbProfilePattern.test(baseUrl)) {
			const profileId = baseUrl.match(fbProfilePattern)?.[1]
			return {
				webUrl: `https://www.facebook.com/profile.php?id=${profileId}`,
				mobileUrl: `fb://profile/${profileId}`,
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

	makeYoutubeResponseHtml(redirectUrl: string, webUrl: string) {
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta property="og:url" content="${webUrl}" >
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

	makeInstagramResponseHtml(redirectUrl: string, webUrl: string) {
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta property="og:url" content="${webUrl}" >
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

	async makeFacebookResponseHtml(redirectUrl: string, webUrl: string) {
		const ogsResult = await ogs({ url: webUrl })

		let meta = ''
		if (ogsResult.result.ogTitle) {
			meta += `<meta property="og:title" content="${ogsResult.result.ogTitle}" >`
		}
		if (ogsResult.result.ogDescription) {
			meta += `<meta property="og:description" content="${ogsResult.result.ogDescription}" >`
		}
		if (ogsResult.result.ogImage && ogsResult.result.ogImage.length) {
			meta += `<meta property="og:image" content="${ogsResult.result.ogImage[0].url}" >`
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

	getSchemePoints() {
		return [
			{
				expireType: SchemeExpireType.SIX_MONTH,
				type: SchemeType.YOUTUBE_CHANNEL,
				point: 1000,
			},
			{
				expireType: SchemeExpireType.SIX_MONTH,
				type: SchemeType.YOUTUBE_VIDEO,
				point: 400,
			},
			{
				expireType: SchemeExpireType.SIX_MONTH,
				type: SchemeType.INSTAGRAM_PROFILE,
				point: 1000,
			},
			{
				expireType: SchemeExpireType.SIX_MONTH,
				type: SchemeType.INSTAGRAM_POST,
				point: 400,
			},
			{
				expireType: SchemeExpireType.SIX_MONTH,
				type: SchemeType.FACEBOOK_PROFILE,
				point: 1000,
			},
			{
				expireType: SchemeExpireType.SIX_MONTH,
				type: SchemeType.FACEBOOK_POST,
				point: 400,
			},
			{
				expireType: SchemeExpireType.ONE_MONTH,
				type: SchemeType.YOUTUBE_CHANNEL,
				point: 500,
			},
			{
				expireType: SchemeExpireType.ONE_MONTH,
				type: SchemeType.YOUTUBE_VIDEO,
				point: 200,
			},
			{
				expireType: SchemeExpireType.ONE_MONTH,
				type: SchemeType.INSTAGRAM_PROFILE,
				point: 500,
			},
			{
				expireType: SchemeExpireType.ONE_MONTH,
				type: SchemeType.INSTAGRAM_POST,
				point: 200,
			},
			{
				expireType: SchemeExpireType.ONE_MONTH,
				type: SchemeType.FACEBOOK_PROFILE,
				point: 500,
			},
			{
				expireType: SchemeExpireType.ONE_MONTH,
				type: SchemeType.FACEBOOK_POST,
				point: 200,
			},
		]
	}

}

interface UrlTypeResult {
	webUrl: string;
	mobileUrl: string;
}
