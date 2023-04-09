import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BannerType } from 'src/common/enums/banner-type';
import { Type } from 'class-transformer';

export class BannerEditDTO {
  @ApiProperty({
    example: '오픈 기념 3000원 할인권',
    description: '배너명',
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: [
      BannerType.BannerMain,
      BannerType.PopupButtom,
      BannerType.PopupModal,
    ],
    example: BannerType.PopupModal,
    description: '분류(bannerMain, popupModal(중앙), popupButtom)',
    required: true,
  })
  @IsEnum(BannerType)
  type: BannerType;

  @ApiProperty({
    example: '2022-03-03 12:00:00',
    description: '적용기간 - 시작일',
  })
  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @ApiProperty({
    example: '2022-03-07 12:00:00',
    description: '적용기간 - 종료일',
  })
  @Type(() => Date)
  @IsDate()
  endedAt: Date;

  @ApiProperty({
    example: false,
    description: '비활성 여부',
  })
  @IsBoolean()
  isDisabled: boolean;

  @ApiProperty({
    example: '설명',
    description: '설명',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/owner/a214e6cf-68f8-4485-b99e-f3d8d3a8d461.jpg',
    description: '이미지 url',
  })
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty({
    example: 'https://naver.com',
    description: '링크(http, event:id, notice:id',
  })
  @IsOptional()
  @IsString()
  link: string;
}
