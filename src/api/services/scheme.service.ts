import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SchemeRepository } from '../repositories/scheme.repository'
import { SchemeModel, SchemeType } from '../dtos/models/scheme.model'
import { plainToInstance } from 'class-transformer'

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
const profilePattern = /^(https?:\/\/)?(www\.)?instagram\.com\/([\w\p{L}-]+)/
const postPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/p\/([\w-]+)/

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

	async addScheme(url: string, type: SchemeType, path: string, userId: number) {
		const scheme = this.schemeRepository.create({
			path, url, userId, type,
		})
		await this.schemeRepository.save(scheme)
		const customUrl = this.makeCusotmUrl(type, path)
		return plainToInstance(SchemeModel, {
			...scheme,
			customUrl,
		}, { excludeExtraneousValues: true })
	}

	private makeCusotmUrl(type: SchemeType, path: string) {
		switch (type) {
			case SchemeType.YOUTUBE_CHANNEL:
				return `https://s.mug-space.io/s/youtube/c/${path}`
			case SchemeType.YOUTUBE_VIDEO:
				return `https://s.mug-space.io/s/youtube/v/${path}`
			case SchemeType.INSTAGRAM_PROFILE:
				return `https://s.mug-space.io/s/instagram/u/${path}`
			case SchemeType.INSTAGRAM_POST:
				return `https://s.mug-space.io/s/instagram/p/${path}`
			default:
				return ''
		}
	}

	async updateScheme(id: number, url: string, userId: number) {
		const scheme = await this.schemeRepository.findOne({ where: {
			id,
		} })
		if (scheme) {
			if (scheme.userId === userId) {
				scheme.url = url
				await this.schemeRepository.save(scheme)
				const customUrl = this.makeCusotmUrl(scheme.type, scheme.path)
				return plainToInstance(SchemeModel, { ...scheme, customUrl }, { excludeExtraneousValues: true })

			}
		}
		return null
	}

	async getSchemeList(userId: number) {
		const list = await this.schemeRepository.find({ where: {
			userId,
		} })
		return list.map((scheme) => {
			return plainToInstance(SchemeModel, {
				...scheme,
				customUrl: this.makeCusotmUrl(scheme.type, scheme.path),
			}, { excludeExtraneousValues: true })
		})

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
			}, { excludeExtraneousValues: true })
		}
		return null
	}

	makeAndroidSchemeUrl(url: string) {
		if (url.includes('youtube.com')) {
			return `intent://${url.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.youtube;scheme=https;end;`
		} else if (url.includes('youtu.be')) {
			return `intent://${url.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.youtube;scheme=https;end;`
		} else {
			return url
		}
	}

	makeIOSSchemeUrl(url: string) {
		return `youtube://${url.replace('https://', '')}`
	}

	validUrl(type: SchemeType, url: string) {
		if (type === SchemeType.YOUTUBE_CHANNEL) {
			return channelPattern.test(url)
		} else if (type === SchemeType.YOUTUBE_VIDEO) {
			return (videoPattern.test(url) || shortPattern.test(url) || livePattern.test(url) || youtuPattern.test(url))
		}
		return false
	}

	makeInstagramProfileUrl(url: string): InstagramUrlTypeResult {
		if (profilePattern.test(url)) {
			const matches = url.match(profilePattern)
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

	makeInstagramPostUrls(url: string): InstagramUrlTypeResult {
		if (postPattern.test(url)) {
			const matches = url.match(postPattern)
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

	makeResponseHtml(redirectUrl: string, webUrl: string) {
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
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

}

interface InstagramUrlTypeResult {
	webUrl: string;
	mobileUrl: string;
}
