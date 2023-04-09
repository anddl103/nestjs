import { PickType } from '@nestjs/swagger';
import { CategoryEntity } from '../../common/entities/categories.entity';

export class CategoryDetailDTO extends PickType(CategoryEntity, [
  'id',
  'name',
  'createdAt',
] as const) {}
