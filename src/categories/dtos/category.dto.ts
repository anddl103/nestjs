import { PartialType } from '@nestjs/swagger';
import { CategoryEntity } from '../../common/entities/categories.entity';

export class CategoryDTO extends PartialType(CategoryEntity) {}
