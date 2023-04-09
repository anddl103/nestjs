import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MenuPriceEditDTO } from './menu-price-edit.dto';

export class MenuEditDTO {
  @ApiProperty({
    example: 1,
    description: '메뉴그룹 리스트에서 원하는 메뉴그룹의 id 를 입력',
    required: true,
  })
  @IsNotEmpty({ message: '메뉴그룹 아이디( menuGroupId )를 입력해주세요.' })
  @IsPositive()
  menuGroupId: number;

  @ApiProperty({
    example: '후라이드치킨',
    description: '메뉴명',
    required: true,
  })
  @IsNotEmpty({ message: '메뉴명( name )을 입력해주세요.' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: '오트밀, 퀴노아, 아마란스 등 슈퍼푸드로 바삭함을 살린 후라이드',
    description: '메뉴설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    example: [
      {
        name: '1-2인분',
        discount: 0,
        price: 16900,
      },
      {
        name: '3-4인분',
        discount: 0,
        price: 26900,
      },
    ],
    description: '메뉴가격 리스트( 1 ~ 10개 )',
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => MenuPriceEditDTO)
  menuPrices: MenuPriceEditDTO[];

  @ApiProperty({
    example: [1, 2],
    description: '필수 옵션그룹 아이디 리스트( 0 ~ 20개 )',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(20)
  requiredOptionIds: number[];

  @ApiProperty({
    example: [1, 2],
    description: '선택 옵션그룹 아이디 리스트( 0 ~ 20개 )',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(20)
  optionalOptionIds: number[];

  @ApiProperty({
    example: false,
    description: '대표메뉴 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSignature: boolean;

  @ApiProperty({
    example: false,
    description: '인기메뉴 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPopular: boolean;

  @ApiProperty({
    example: false,
    description: '품절 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSoldout: boolean;

  @ApiProperty({
    example: false,
    description: '기부메뉴 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDonation: boolean;

  @ApiProperty({
    example: 1,
    description: '메뉴 이미지파일 아이디',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  imageFileId: number;
}
