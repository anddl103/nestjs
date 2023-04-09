import { ApiProperty, PickType } from '@nestjs/swagger';
import { NoticeEntity } from '../../common/entities/notices.entity';

export class NoticeListDTO extends PickType(NoticeEntity, [
  'id',
  'createdAt',
  'title',
  'imageUrl',
  'hitCount',
] as const) {
  @ApiProperty({
    example: {
      fullName: '오사장',
    },
    description: '작성자 이름',
  })
  owner: object;
}
