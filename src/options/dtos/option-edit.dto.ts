import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OptionEditDTO {
  @ApiProperty({
    example: '양념소스',
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
