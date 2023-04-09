import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MenuGroupType } from 'src/common/enums/menu-group-type';

export class MenuGroupRegisterDTO {
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
}
