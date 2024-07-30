// import { Injectable } from '@nestjs/common'
// import { google } from 'googleapis'
// import axios from 'axios'

// @Injectable()
// export class YoutubeApiService {
// 	private readonly youtube = google.youtube('v3')
// 	private readonly API_KEY = 'AIzaSyAxBPz__RwVzniGkG1mQeXIdTe70GtTQQo'
// 	private readonly MAX_RESULTS = 10

// 	async getChannels() {
// 		const channelNames = [ 'askmeanything_heayun' ]
// 		for (const channelName of channelNames) {
// 			const channelId = await this.getChannelId(channelName)
// 			if (channelId) {
// 				const detail = await this.getChannelDetails(channelId)
// 				console.log(channelName)
// 				console.log(detail)

// 			}

// 		}
// 	}

// 	async getChannelDetails(channelId: string) {
// 		const response = await this.youtube.channels.list({
// 			key: this.API_KEY,
// 			part: [ 'snippet', 'statistics' ],
// 			id: [ channelId ],
// 		})
// 		if (response.data.items) {
// 			const channel = response.data.items[0]
// 			if (channel.statistics?.subscriberCount
// 			// && Number(channel.statistics.subscriberCount) >= 100000
// 			) {
// 				const email = null
// 				const emails = !email && channel.snippet?.description ? this.extractEmails(channel.snippet.description) : []
// 				if (email) {
// 					emails.push(email)
// 				}
// 				return {
// 					title: channel.snippet?.title,
// 					subscriberCount: parseInt(channel.statistics.subscriberCount, 10),
// 					emails: emails,
// 					country: channel.snippet?.country || 'KR',
// 				}
// 			}
// 		}

// 		return null
// 	}

// 	async getChannelId(channelName: string) {
// 		const options = {
// 			method: 'GET',
// 			url: 'https://youtube-v2.p.rapidapi.com/channel/id',
// 			params: {
// 			  channel_name: channelName,
// 			},
// 			headers: {
// 			  'x-rapidapi-key': '2817c39907msh6724e064079b7a2p186d24jsn076d1c7e2627',
// 			  'x-rapidapi-host': 'youtube-v2.p.rapidapi.com',
// 			},
// 		  }

// 		  try {
// 			  const response = await axios.request<{ channel_id: string, channel_name: string }>(options)
// 			  return response.data.channel_id
// 		  } catch (error) {
// 			  console.error(error)
// 			  return null
// 		  }
// 	}

// 	async getChannelDetail(channelId: string) {
// 		const options = {
// 			method: 'GET',
// 			url: 'https://youtube-v2.p.rapidapi.com/channel/details',
// 			params: {
// 			  channel_id: channelId,
// 			},
// 			headers: {
// 			  'x-rapidapi-key': '2817c39907msh6724e064079b7a2p186d24jsn076d1c7e2627',
// 			  'x-rapidapi-host': 'youtube-v2.p.rapidapi.com',
// 			},
// 		  }

// 		  try {
// 			  const response = await axios.request(options)
// 			  return response.data
// 		  } catch (error) {
// 			  console.error(error)
// 			  return null
// 		  }
// 	}

// 	// async getChannelEmail(channelId: string): Promise<string | null> {
// 	// 	const url = `https://www.youtube.com/channel/${channelId}/about`

// 	// 	try {
// 	// 		const response = await axios.get(url)
// 	// 		const $ = cheerio.load(response.data)
// 	// 		const emailElement = $('a[href^="mailto:"]').first()
// 	// 		const email = emailElement.attr('href') ? emailElement.attr('href')!.replace('mailto:', '') : null
// 	// 		return email
// 	// 	} catch (error) {
// 	// 		console.error(`Error fetching email for channelId ${channelId}:`, error)
// 	// 		return null
// 	// 	}
// 	// }

// 	private extractEmails(text: string): string[] {
// 		const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g
// 		const matches = text.match(emailRegex)
// 		return matches || []
// 	  }

// }

// const koreanInfluencers: string[] = [
// 	'BuzzBean11', // 대도서관
// 	'yangpang', // 양팡
// 	'bogyungman', // 보겸
// 	'koreanenglishman', // 영국남자
// 	'heopop', // 허팝
// 	'dottytv', // 도티
// 	'risabaeart', // 이사배
// 	'moonbokhee', // 문복희
// 	'ssin', // 씬님
// 	'hamzy', // 햄지
// 	'Shorter_YES', // 입짧은햇님
// 	'awesomehaeun', // 어썸하은
// 	'konjacpangg', // 곤약팡
// 	'physicalgallery', // 피지컬갤러리
// 	'quaddurup', // 꽈뚜룹
// 	'jangbbijju', // 장삐쭈
// 	'jaewon_tv', // 김재원
// 	'bjimda', // BJ임다
// 	'ambro', // 엠브로
// 	'yangpaTV', // 양배추
// 	'changhyun_m', // 창현
// 	'gams_02', // 감스트
// 	'bluekim', // 김블루
// 	'zzamtrutv', // 잠뜰
// 	'domingTV', // 도밍
// 	'awesome_yoonhee', // 어썸윤희
// 	'seungwooappa', // 승우아빠
// 	'malwang', // 말왕
// 	'whitneybae', // 휘트니
// 	'myrintv', // 마이린
// 	'sovietgirl', // 소련여자
// 	'great_instructor', // 대왕강사
// 	'hueuncommon', // 흔한남매
// 	'run_chicken', // 달려라치킨
// 	'bigheadv', // 빅헤드
// 	'sssoyoung', // 쏘영
// 	'aguebo', // 아구이뽀
// 	'mysai', // 마이싸이
// 	'eatingguy', // 밴쯔
// 	'wangjuu', // 왕쥬
// 	'garurang', // 가루낭자
// 	'sungshinhun', // 성시훈
// 	'syugichannel', // 슈기
// 	'imdabang', // 임다
// 	'yangsubin', // 양수빈
// 	'bigjo', // 빅죠
// 	'miseon_impossible', // 미선임파서블
// 	'youjeonghotv', // 유정호TV
// 	'shinsaimdang', // 신사임당
// 	'parkmakrae', // 박막례
// 	'heyjini', // 헤이지니
// 	'enjoycouple', // 엔조이커플
// 	'yourajun', // 유라준
// 	'kimgyeoran', // 김계란
// 	'littlerody', // 리틀로디
// 	'fumei', // 푸메
// 	'ddonggaetteong', // 떵개떵
// 	'chaeseon', // 채희선
// 	'jaenuntv', // 재넌
// 	'reviewking', // 리뷰왕좌
// 	'seokhyun_tv', // 석현이네
// 	'socouple', // 소근커플
// 	'yangsubin', // 양수빈
// 	'bokhee', // 복희
// 	'moongyeong', // 문에스더
// 	'maychannel', // 메이
// 	'narum', // 나름
// 	'sovietgirl', // 소련여자
// 	'youngsik', // 영식이형
// 	'ponysyndrome', // 포니
// 	'kimsungtae', // 김성태
// 	'moonbokhee', // 문복희
// 	'physicalgallery', // 피지컬갤러리
// 	'ddeukki', // 깨방정
// 	'ssoyoung', // 쏘영
// 	'yangpang', // 양팡
// 	'heopop', // 허팝
// 	'dottytv', // 도티
// 	'changhyun_m', // 창현
// 	'gams_02', // 감스트
// 	'kimdaks', // 킴닥스
// 	'koreanblue', // 김블루
// 	'soobingsu', // 수빙수
// 	'whiteshop', // 하얀상점
// 	'aejugatvpd', // 애주가TV참PD
// 	'cheesefilm', // 치즈필름
// 	'jaejae', // 재재
// 	'jinyongjin', // 진용진
// 	'dalla_studio', // 달라스튜디오
// 	'officeworkera', // 회사원A
// 	'wassupman', // 와썹맨
// 	'workman', // 워크맨
// 	'hisubin', // 하이수빈
// 	'jjsalondefit', // 제이제이살롱드핏
// 	'yumddaeng', // 윰댕
// 	'sensibilitypz', // 감성피지
// 	'jflamusic', // 제이플라
// ]
