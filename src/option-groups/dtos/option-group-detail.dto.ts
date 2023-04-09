import { PickType } from '@nestjs/swagger';
import { OptionGroupEntity } from '../../common/entities/option-groups.entity';

export class OptionGroupDetailDTO extends PickType(OptionGroupEntity, [
  'id',
  'createdAt',
  'storeId',
  'name',
  'isRequired',
  'minOption',
  'maxOption',
  'optionCount',
  'position',
] as const) {}
