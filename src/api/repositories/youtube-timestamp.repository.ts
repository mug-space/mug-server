import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { YoutubeTimestampEntity } from '../entities/youtube-timestamp.entity'

@CustomRepository(YoutubeTimestampEntity)
export class YoutubeTimestampRepository extends Repository<YoutubeTimestampEntity> {
}
