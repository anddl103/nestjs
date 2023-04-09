import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';

export class StoreOwnerSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '',
    description: '검색어 입력',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;
}
