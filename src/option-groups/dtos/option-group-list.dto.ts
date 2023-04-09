import { PickType } from '@nestjs/swagger';
import { OptionGroupEntity } from '../../common/entities/option-groups.entity';

export class OptionGroupListDTO extends PickType(OptionGroupEntity, [
  'id',
  'createdAt',
  'name',
  'isRequired',
  'minOption',
  'maxOption',
  'optionCount',
  'position',
] as const) {}
