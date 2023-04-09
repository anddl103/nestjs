import { PickType } from '@nestjs/swagger';
import { OptionEntity } from '../../common/entities/options.entity';

export class OptionDetailDTO extends PickType(OptionEntity, [
  'id',
  'createdAt',
  'storeId',
  'optionGroupId',
  'name',
  'price',
  'isSoldout',
  'position',
] as const) {}
