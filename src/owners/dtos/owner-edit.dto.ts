import { PickType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerEditDTO extends PickType(OwnerEntity, [
  'fullName',
  'businessName',
  'businessNumber',
] as const) {}
