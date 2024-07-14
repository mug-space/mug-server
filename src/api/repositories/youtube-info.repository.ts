import { CustomRepository } from 'src/common/db/custom-repository.decorator'
import { Repository } from 'typeorm'
import { YoutubeInfoEntity } from '../entities/youtube-info.entity'

@CustomRepository(YoutubeInfoEntity)
export class YoutubeInfoRepository extends Repository<YoutubeInfoEntity> {
}
