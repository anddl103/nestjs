import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';
import { IsOnlyDate } from '../../common/decorators/dngg-date.decorator';
import { SettlementStoreDateType } from '../../common/enums/settlement-store-date-type';

export class SettlementStoreSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    enum: [
      SettlementStoreDateType.ExpectedDate,
      SettlementStoreDateType.DoneDate,
    ],
    example: SettlementStoreDateType.ExpectedDate,
    description: '조회대상(expectedDate:정산예정일, doneDate:정산완료일)',
    required: false,
  })
  @IsOptional()
  @IsEnum(SettlementStoreDateType)
  dateType: SettlementStoreDateType;

  @ApiProperty({
    example: '2022-07-01',
    description: '조회기간(fromDate)',
    required: false,
  })
  @IsOptional()
  @IsOnlyDate()
  fromDate: string;

  @ApiProperty({
    example: '2022-09-30',
    description: '조회기간(toDate)',
    required: false,
  })
  @IsOptional()
  @IsOnlyDate()
  toDate: string;
}
