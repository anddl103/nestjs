import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { RecommendCategoryAreaEntity } from './recommend-category-areas.entity';
import { LocalDateTimeTransformer } from '../transformers/local-date-time-transformer';

@Entity({
  name: 'recommend_category',
})
export class RecommendCategoryEntity extends CommonEntity {
  @ApiProperty({
    example: '여름추천메뉴',
    description: '추천주제',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: '치킨',
    description: '메뉴키워드 1',
  })
  @Column({ type: 'varchar', nullable: false })
  menuKeyword1: string;

  @ApiProperty({
    example: '피자',
    description: '메뉴키워드 2',
  })
  @Column({ type: 'varchar', nullable: true })
  menuKeyword2: string;

  @ApiProperty({
    example: '햄버거',
    description: '메뉴키워드 3',
  })
  @Column({ type: 'varchar', nullable: true })
  menuKeyword3: string;

  @ApiProperty({
    example: '2022-06-01 10:00:00',
    description: '시작일',
  })
  @Column({
    type: 'timestamp',
    transformer: new LocalDateTimeTransformer(),
    nullable: false,
  })
  startedAt: Date;

  @ApiProperty({
    example: '2022-08-31 20:00:00',
    description: '종료일',
  })
  @Column({
    type: 'timestamp',
    transformer: new LocalDateTimeTransformer(),
    nullable: false,
  })
  endedAt: Date;

  @ApiProperty({
    example: false,
    description: '노출지역 전체 여부',
  })
  @Column({ type: 'boolean', default: false })
  isAllAreas: boolean;

  @ApiProperty({
    example: false,
    description: '노출 여부',
  })
  @Column({ type: 'boolean', default: false })
  isDisplayed: boolean;

  @ApiProperty({
    example: 1,
    description: '노출 순서',
  })
  @Column({ type: 'int', nullable: false })
  position: number;

  @OneToMany(
    () => RecommendCategoryAreaEntity,
    (recommendCategoryArea) => recommendCategoryArea.recommendCategory,
  )
  recommendCategoryAreas: RecommendCategoryAreaEntity[];
}
