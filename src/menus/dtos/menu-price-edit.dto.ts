import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class MenuPriceEditDTO {
  @ApiProperty({
    example: '1-2인분',
    description: '메뉴가격명( 메뉴가격 항목이 복수 개의 경우 필요 )',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 16900,
    description: '할인율 Percent( 0 ~ 99 )',
    required: true,
  })
  @IsNotEmpty({ message: '할인율( discount )을 입력해주세요.' })
  @IsInt()
  discount: number;

  @ApiProperty({
    example: 16900,
    description: '메뉴가격',
    required: true,
  })
  @IsNotEmpty({ message: '메뉴가격( price )을 입력해주세요.' })
  @IsPositive()
  price: number;
}
