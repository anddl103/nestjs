import { PickType } from '@nestjs/swagger';
import { RecommendCategoryEntity } from '../../common/entities/recommend-categories.entity';

export class RecommendCategoryListDTO extends PickType(
  RecommendCategoryEntity,
  [
    'id',
    'name',
    'menuKeyword1',
    'menuKeyword2',
    'menuKeyword3',
    'startedAt',
    'endedAt',
    'isDisplayed',
  ] as const,
) {}
