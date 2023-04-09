import { PartialType } from '@nestjs/swagger';
import { RecommendCategoryEntity } from '../../common/entities/recommend-categories.entity';

export class RecommendCategoryDTO extends PartialType(
  RecommendCategoryEntity,
) {}
