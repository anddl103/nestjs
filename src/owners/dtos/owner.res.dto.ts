import { ApiProperty, PickType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerResDTO extends PickType(OwnerEntity, [
  'id',
  'username',
  'phoneNumber',
  'roleId',
  'isConfirmed',
] as const) {
  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  storeId: number;
}
