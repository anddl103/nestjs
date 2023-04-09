import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { CommonSearchRequestDTO } from 'src/common/dtos/common.search.req.dto';

export class CouponSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '할인',
    description: '쿠폰명 검색어 입력',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: '가게 아이디(점주 시 필수)',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  storeId: number;
}
