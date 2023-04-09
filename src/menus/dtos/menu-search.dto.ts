import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';

export class MenuSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: 12,
    description:
      '가게 리스트에서 원하는 가게의 id 를 입력<br>점주의 경우 auth/me > storeId 를 입력',
    required: true,
  })
  @IsNumberString()
  storeId: number;

  @ApiProperty({
    example: 0,
    description:
      '메뉴그룹 리스트에서 원하는 메뉴그룹의 id 를 입력<br>menuGroupId 가 0 이면 전체 메뉴',
    required: true,
  })
  @IsNumberString()
  menuGroupId: number;

  @ApiProperty({
    example: '',
    description: '검색어 입력',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;
}
