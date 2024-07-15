import { ValueTransformer } from 'typeorm'
import dayjs from 'dayjs'

export class DateTransformer implements ValueTransformer {
	// entity -> db로 넣을때
	to(entityValue?: number | null): Date | null | undefined {
	  return entityValue ? dayjs(entityValue).toDate() : undefined
	}

	// db -> entity로 가져올때
	from(databaseValue?: Date | null): number | null {
	  return databaseValue ? dayjs(databaseValue).valueOf() : null
	}
}
