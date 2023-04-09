import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RecommendCategoryAreaFormDTO } from './recommend-category-area-form.dto';

export class RecommendCategoryFormDTO {
  @ApiProperty({
    example: '여름추천메뉴',
    description: '추천주제',
    required: true,
  })
  @IsNotEmpty({ message: '추천주제( name )을 입력해주세요.' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: '2022-06-01 00:00:00',
    description: '시작일',
    required: true,
  })
  @IsNotEmpty({ message: '시작일( startedAt )을 입력해주세요.' })
  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @ApiProperty({
    example: '2022-08-31 23:59:59',
    description: '종료일',
    required: true,
  })
  @IsNotEmpty({ message: '종료일( endedAt )을 입력해주세요.' })
  @Type(() => Date)
  @IsDate()
  endedAt: Date;

  @ApiProperty({
    example: '치킨',
    description: '메뉴키워드 1',
    required: true,
  })
  @IsNotEmpty({ message: '메뉴키워드( menuKeyword1 )을 입력해주세요.' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  menuKeyword1: string;

  @ApiProperty({
    example: '피자',
    description: '메뉴키워드 2',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  menuKeyword2: string;

  @ApiProperty({
    example: '햄버거',
    description: '메뉴키워드 3',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  menuKeyword3: string;

  @ApiProperty({
    example: false,
    description: '노출지역 전체 여부',
    required: true,
  })
  @IsBoolean()
  isAllAreas: boolean;

  @ApiProperty({
    example: false,
    description: '노출 여부',
    required: true,
  })
  @IsBoolean()
  isDisplayed: boolean;

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
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(17)
  @ValidateNested({ each: true })
  @Type(() => RecommendCategoryAreaFormDTO)
  recommendCategoryAreas: RecommendCategoryAreaFormDTO[];
}
