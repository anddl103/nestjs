import { PickType } from '@nestjs/swagger';
import { CategoryEntity } from '../../common/entities/categories.entity';

export class CategoryListDTO extends PickType(CategoryEntity, [
  'id',
  'name',
] as const) {}
