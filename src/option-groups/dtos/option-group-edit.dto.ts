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

export class OptionGroupEditDTO {
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

  @ApiProperty({
    example: 3,
    description:
      '최대 옵션선택수( 필수일 경우 1, 선택일 경우 옵션그룹 안의 총 옵션수 이하 )',
    required: true,
  })
  @IsNotEmpty({ message: '최대 옵션선택수( maxOption )을 입력해주세요.' })
  @IsPositive()
  maxOption: number;

  @ApiProperty({
    example: 1,
    description: '노출순서',
    required: true,
  })
  @IsNotEmpty({ message: '노출순서( position )를 입력해주세요.' })
  @IsNumber()
  position: number;
}
