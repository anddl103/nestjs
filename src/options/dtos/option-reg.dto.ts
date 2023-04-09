import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OptionRegisterDTO {
  @ApiProperty({
    example: 12,
    description:
      '가게 리스트에서 원하는 가게의 id 를 입력<br>점주의 경우 me > storeId 를 입력',
    required: true,
  })
  @IsNotEmpty({ message: '가게 아이디( storeId )를 입력해주세요.' })
  @IsNumber()
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '옵션그룹 리스트에서 원하는 옵션그룹의 id 를 입력',
    required: true,
  })
  @IsNotEmpty({ message: '옵션그룹 아이디( optionGroupId )를 입력해주세요.' })
  @IsPositive()
  optionGroupId: number;

  @ApiProperty({
    example: '포장무',
    description: '옵션명',
    required: true,
  })
  @IsNotEmpty({ message: '옵션명( name )을 입력해주세요.' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: 500,
    description: '옵션가격',
    required: true,
  })
  @IsNotEmpty({ message: '옵션가격( price )을 입력해주세요.' })
  @IsInt()
  price: number;

  @ApiProperty({
    example: false,
    description: '품절 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSoldout: boolean;
}
