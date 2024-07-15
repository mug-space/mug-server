import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InquiryRepository } from '../repositories/inquiry.repository'
import { plainToInstance } from 'class-transformer'
import { InquiryModel } from '../dtos/models/inquiry.model'

@Injectable()
export class InquiryService {

	@InjectRepository(InquiryRepository)
	private readonly inquiryRepository: InquiryRepository

	async addInquiry(userId: number, title: string, content: string) {
		const inquiry = this.inquiryRepository.create({
			userId, title, content,
		})
		await this.inquiryRepository.save(inquiry)
	}

	async getInquiry(userId: number, id: number) {
		const inquiry = await this.inquiryRepository.findOne({ where: {
			userId, id,
		} })
		if (inquiry) {
			return plainToInstance(InquiryModel, inquiry, { excludeExtraneousValues: true })
		}
		return null
	}

	async getInquiryList(userId: number) {
		const inquiries = await this.inquiryRepository.find(
			{ where: {
				userId,
			},
			order: { id: 'DESC' },
			})
		return inquiries.map((inquiry) => plainToInstance(InquiryModel, inquiry, { excludeExtraneousValues: true }))
	}
}
