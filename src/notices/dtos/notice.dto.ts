import { PartialType } from '@nestjs/swagger';
import { NoticeEntity } from '../../common/entities/notices.entity';

export class NoticeDTO extends PartialType(NoticeEntity) {}
