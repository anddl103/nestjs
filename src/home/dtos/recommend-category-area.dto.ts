import { PickType } from '@nestjs/swagger';
import { RecommendCategoryAreaEntity } from '../../common/entities/recommend-category-areas.entity';

export class RecommendCategoryAreaDTO extends PickType(
  RecommendCategoryAreaEntity,
  ['name'] as const,
) {}
