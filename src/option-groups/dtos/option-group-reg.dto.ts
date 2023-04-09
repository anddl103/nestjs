import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OptionGroupRegisterDTO {
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
    example: '필수옵션',
    description: '옵션그룹명',
    required: true,
  })
  @IsNotEmpty({ message: '옵션그룹명( name )을 입력해주세요.' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: true,
    description: '옵션종류( true: 필수, false: 선택 )',
    required: true,
  })
  @IsNotEmpty({ message: '옵션종류( isRequired )을 입력해주세요.' })
  @IsBoolean()
  isRequired: boolean;
}
