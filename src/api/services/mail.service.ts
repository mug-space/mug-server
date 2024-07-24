import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

export interface EmailParams {
	to: string;
	from: string;
	subject: string;
	htmlBody: string;
}

@Injectable()
export class MailService {

	private transporter: nodemailer.Transporter

	constructor(
		private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
		  host: this.configService.get<string>('ZOHO_SMTP_HOST', 'smtp.zoho.com'),
		  port: this.configService.get<number>('ZOHO_SMTP_PORT', 587),
		  secure: false, // true for 465, false for other ports
		  auth: {
				user: this.configService.get<string>('ZOHO_USER', 'contact@mug-space.io'),
				pass: this.configService.get<string>('ZOHO_PASS', 'Kk4903198!'),
		  },
		})
	}

	async sendUserConfirmation(userEmail: string, userName: string, _youtubeName: string, _couponCode: string) {
		const url = 'https://mug-space.io'

		const mailOptions = {
		  from: `=?UTF-8?B?${Buffer.from('머그스페이스').toString('base64')}?= <contact@mug-space.io>`,
		  to: userEmail,
		  subject: `${userName}님 안녕하세요. '머그스페이스' 입니다`,
			//   text: `Hello toby, please confirm your email by clicking the following link: ${url}`,
		  html: `
		 <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>협업 제안 메일</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 90%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #007bff;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin: 10px 0;
            font-size: 16px;
        }
        .content img {
            width: 100%;
            max-width: 100%;
            height: auto;
            margin: 10px 0;
        }
        .button-container {
            text-align: center;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .coupon {
            background-color: #e0ffe0;
            border: 1px dashed #008000;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            padding: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>안녕하세요, [크리에이터 이름]님!</h1>
        </div>
        <div class="content">
            <p>저는 [귀하의 이름]이며, [귀하의 회사/프로젝트/채널 이름]에서 [귀하의 직책]을 맡고 있습니다.</p>
            <p>우연히 [크리에이터 이름]님의 유튜브 채널을 발견하게 되었고, [특정 콘텐츠, 예: 최근 업로드한 비디오 제목]를 특히 인상 깊게 보았습니다. [크리에이터 이름]님의 콘텐츠는 [특정 요소, 예: 창의적인 편집 스타일, 유익한 정보 등]이 돋보여 많은 사람들에게 유익함을 주고 있다고 생각합니다.</p>
            <img src="https://assets-global.website-files.com/62a6f472a43450de7620f8f5/63ed16c64c704f1970116f25_63ebbe0e8dce940f25ee7395_YouTube%2520Timestamp%2520Generator%2520-%2520Header.jpeg" alt="YouTube Chapters Benefits">
            <p>저희는 유튜브 영상을 더욱 편리하게 관리할 수 있도록 돕는 새로운 서비스를 출시했습니다. 이 서비스는 유튜브 영상 링크만 입력하면 자동으로 유튜브 챕터를 생성해주는 기능을 제공합니다.</p>
            <p>유튜브 챕터를 활용하면 다음과 같은 장점이 있습니다:</p>
            <ul>
                <li><strong>알고리즘 최적화</strong>: 유튜브 챕터를 사용하면 동영상이 검색 엔진에 더 잘 노출됩니다.</li>
                <li><strong>사용자 경험 향상</strong>: 시청자들이 원하는 부분을 쉽게 찾을 수 있어 더 오래 머무르게 됩니다.</li>
                <li><strong>구독자 증가</strong>: 유용한 챕터 기능 제공으로 채널에 대한 신뢰도가 올라갑니다.</li>
                <li><strong>콘텐츠 이해도 증대</strong>: 중요한 포인트를 강조할 수 있어 시청자들이 내용을 쉽게 이해할 수 있습니다.</li>
            </ul>
            <p>초기에 서비스의 성능을 평가하고 피드백을 얻기 위해 [크리에이터 이름]님께 서비스를 무료로 이용해볼 수 있는 기회를 드리고자 합니다. 아래의 쿠폰코드를 사용하시면 포인트가 충전되며, 이를 통해 서비스를 체험해보실 수 있습니다.</p>
            <div class="coupon">
                <p><strong>쿠폰 코드: FREECHAPTERS</strong></p>
                <p>포인트 충전: 100포인트</p>
            </div>
            <div class="button-container">
                <a href="https://your-service-url.com" class="button">서비스 체험하기</a>
            </div>
        </div>
        <div class="footer">
            <p>감사합니다, [귀하의 이름] 드림</p>
        </div>
    </div>
</body>
</html>
		  `,
		}

		await this.transporter.sendMail(mailOptions)
	  }

}
