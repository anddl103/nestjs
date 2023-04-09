import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonSearchRequestDTO } from 'src/common/dtos/common.search.req.dto';
import { BannerType } from 'src/common/enums/banner-type';

export class BannerSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '',
    description: '배너 검색어 입력',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;

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
  @IsOptional()
  @IsEnum(BannerType)
  type: BannerType;
}
