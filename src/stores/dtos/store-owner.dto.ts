import { ApiProperty, PickType } from '@nestjs/swagger';
import { StoreEntity } from '../../common/entities/stores.entity';
import { OwnerDetailDTO } from '../../owners/dtos/owner-detail.dto';

export class StoreOwnerDTO extends PickType(StoreEntity, [
  'id',
  'createdAt',
  'category',
  'name',
  'address1',
  'address2',
  'phoneNumber',
] as const) {
  @ApiProperty({
    example: {
      id: 14,
      username: 'store12@test.com',
      fullName: '오사장',
      phoneNumber: '010-1111-3333',
      businessName: '바른치킨공덕파크자이점',
      businessNumber: '123-12-12345',
    },
    description: '점주 정보',
  })
  owner: OwnerDetailDTO;
}
