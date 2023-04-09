import { ApiProperty, PickType } from '@nestjs/swagger';
import { RecommendCategoryEntity } from '../../common/entities/recommend-categories.entity';
import { RecommendCategoryAreaDTO } from './recommend-category-area.dto';

export class RecommendCategoryDetailDTO extends PickType(
  RecommendCategoryEntity,
  [
    'id',
    'createdAt',
    'name',
    'menuKeyword1',
    'menuKeyword2',
    'menuKeyword3',
    'startedAt',
    'endedAt',
    'isAllAreas',
    'isDisplayed',
  ] as const,
) {
  @ApiProperty({
    example: [
      {
        name: 'gangwon',
      },
      {
        name: 'seoul',
      },
    ],
    description: '노출지역 리스트( 최대 17개 시도 )',
  })
  recommendCategoryAreas: RecommendCategoryAreaDTO[];
}
