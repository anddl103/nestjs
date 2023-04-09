import { ApiProperty, PickType } from '@nestjs/swagger';
import { EventEntity } from '../../common/entities/events.entity';

export class EventListDTO extends PickType(EventEntity, [
  'id',
  'createdAt',
  'title',
  'bannerUrl',
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
