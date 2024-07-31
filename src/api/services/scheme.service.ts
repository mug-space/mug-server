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
		const determineUrl = this.determineUrlType(url)
		if ((type === SchemeType.YOUTUBE_VIDEO && determineUrl.type === 'video') ||
		(type === SchemeType.YOUTUBE_CHANNEL && determineUrl.type === 'channel')
		) {
			const urlData = this.makeUrl(url)
			const scheme = this.schemeRepository.create({
				path, url, userId, type, android: urlData.android, ios: urlData.ios,
			})
			await this.schemeRepository.save(scheme)
			return plainToInstance(SchemeModel, scheme, { excludeExtraneousValues: true })
		}

		return null
	}

	async updateScheme(id: number, url: string, userId: number) {
		const scheme = await this.schemeRepository.findOne({ where: {
			id,
		} })
		if (scheme) {
			if (scheme.userId === userId) {
				const determineUrl = this.determineUrlType(url)
				if ((scheme.type === SchemeType.YOUTUBE_VIDEO && determineUrl.type === 'video') ||
		(scheme.type === SchemeType.YOUTUBE_CHANNEL && determineUrl.type === 'channel')
				) {
					const urlData = this.makeUrl(url)
					scheme.url = url
					scheme.android = urlData.android
					scheme.ios = urlData.ios
					await this.schemeRepository.save(scheme)
					return plainToInstance(SchemeModel, scheme, { excludeExtraneousValues: true })
				}

			}
		}
		return null
	}

	async getSchemeList(userId: number) {
		const list = await this.schemeRepository.find({ where: {
			userId,
		} })
		return plainToInstance(SchemeModel, list, { excludeExtraneousValues: true })
	}

	async getSchemeDetail(id: number, userId: number) {
		const scheme = await this.schemeRepository.findOne({
			where: {
				id, userId,
			},
		})
		if (scheme) {
			return plainToInstance(SchemeModel, scheme, { excludeExtraneousValues: true })
		}
		return null

	}

	private makeUrl(url: string) {
		return {
			android: this.generateAndroidIntent(url),
			ios: `youtube://${url.replace('https://', '')}`,
		}
	}

	private generateAndroidIntent(baseUrl: string): string {
		if (baseUrl.includes('youtube.com')) {
			return `intent://${baseUrl.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.youtube;scheme=https;end;`
		} else if (baseUrl.includes('youtu.be')) {
			return `intent://${baseUrl.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.youtube;scheme=https;end;`
		} else {
			return baseUrl
		}
	}

	private determineUrlType(url: string): YoutubeUrlTypeResult {
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

		if (videoPattern.test(url) || shortPattern.test(url) || livePattern.test(url) || youtuPattern.test(url)) {
			return { type: 'video', url }
		} else if (channelPattern.test(url)) {
			return { type: 'channel', url }
		} else {
			return { type: 'unknown', url }
		}
	}

	private generateInstagramUrls(url: string): InstagramUrlTypeResult {
		const profilePattern = /^(https?:\/\/)?(www\.)?instagram\.com\/([\w\p{L}-]+)/
		const postPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/p\/([\w-]+)/

		if (profilePattern.test(url)) {
			const matches = url.match(profilePattern)
			const username = matches ? matches[3] : ''
			return {
				type: 'profile',
				webUrl: `https://www.instagram.com/${username}`,
				mobileUrl: `instagram://user?username=${username}`,
			}
		} else if (postPattern.test(url)) {
			const matches = url.match(postPattern)
			const postId = matches ? matches[3] : ''
			return {
				type: 'post',
				webUrl: `https://www.instagram.com/p/${postId}`,
				mobileUrl: `instagram://media?id=${postId}`,
			}
		} else {
			return {
				type: 'unknown',
				webUrl: url,
				mobileUrl: url,
			}
		}
	}

}

interface YoutubeUrlTypeResult {
	type: 'video' | 'channel' | 'unknown';
	url: string;
}

interface InstagramUrlTypeResult {
	type: 'profile' | 'post' | 'unknown';
	webUrl: string;
	mobileUrl: string;
}
