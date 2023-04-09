import { PickType } from '@nestjs/swagger';
import { OptionEntity } from '../../common/entities/options.entity';

export class OptionListDTO extends PickType(OptionEntity, [
  'id',
  'createdAt',
  'name',
  'price',
  'isSoldout',
  'position',
] as const) {}
