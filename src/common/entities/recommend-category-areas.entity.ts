import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RecommendCategoryEntity } from './recommend-categories.entity';
import { CommonEntity } from './common.entity';

@Entity({
  name: 'recommend_category_area',
})
export class RecommendCategoryAreaEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '추천 카테고리 아이디',
  })
  @Column({ type: 'int', nullable: false })
  recommendCategoryId: number;

  @ApiProperty({
    example: 'large',
    description: '지역분류(대분류-large|중분류-medium|소분류-small)',
  })
  @Column({ type: 'varchar', nullable: false })
  category: string;

  @ApiProperty({
    example: 'seoul',
    description:
      '지역명(seoul|busan|daegu|incheon|gwangju|daejeon|ulsan|sejong|gyeonggi|gangwon|chungbuk|chungnam|jeonbuk|jeonnam|gyeongbuk|gyeongnam|jeju)',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(
    () => RecommendCategoryEntity,
    (recommendCategory) => recommendCategory.recommendCategoryAreas,
  )
  recommendCategory: RecommendCategoryEntity;
}
