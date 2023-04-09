import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MenuGroupType } from 'src/common/enums/menu-group-type';

export class MenuGroupEditDTO {
  @ApiProperty({
    example: '치킨메뉴',
    description: '메뉴그룹명',
    required: true,
  })
  @IsNotEmpty({ message: '메뉴그룹명( name )을 입력해주세요.' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: MenuGroupType.Normal,
    description: '분류(일반-rookie|바우처-regular)',
    enum: MenuGroupType,
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 1,
    description: '노출순서',
    required: true,
  })
  @IsNotEmpty({ message: '노출순서( position )를 입력해주세요.' })
  @IsNumber()
  position: number;
}
