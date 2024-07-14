import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { YoutubeEntity } from '../entities/youtube.entity'

@CustomRepository(YoutubeEntity)
export class YoutubeRepository extends Repository<YoutubeEntity> {
}
