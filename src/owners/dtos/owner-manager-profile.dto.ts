import { PickType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerManagerProfileDTO extends PickType(OwnerEntity, [
  'id',
  'username',
  'fullName',
  'roleId',
  'department',
  'phoneNumber',
  'createdAt',
] as const) {}
