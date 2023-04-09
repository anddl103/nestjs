import { PickType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerManagerDTO extends PickType(OwnerEntity, [
  'id',
  'username',
  'fullName',
  'roleId',
  'department',
  'createdAt',
] as const) {}
