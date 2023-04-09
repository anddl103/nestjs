import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';
import { IsOnlyDate } from '../../common/decorators/dngg-date.decorator';
import { SettlementStatus } from '../../common/enums/settlement-status';
import { SettlementDateType } from '../../common/enums/settlement-date-type';

export class SettlementSumSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '',
    description: '검색어 입력(대상: 상호명, 사업자등록번호)',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({
    enum: [
      SettlementStatus.Ready,
      SettlementStatus.Done,
      SettlementStatus.Pending,
    ],
    example: SettlementStatus.Ready,
    description:
      '구분(ready:정산대기, done:정산완료, pending:정산보류)<br>status 값이 없을 경우 전체',
    required: false,
  })
  @IsOptional()
  @IsEnum(SettlementStatus)
  status: SettlementStatus;

  @ApiProperty({
    enum: [SettlementDateType.CreatedDate, SettlementDateType.DoneDate],
    example: SettlementDateType.CreatedDate,
    description: '조회대상(createdDate:데이터생성일, doneDate:정산완료일)',
    required: true,
  })
  @IsEnum(SettlementDateType)
  dateType: SettlementDateType;

  @ApiProperty({
    example: '2022-07-01',
    description: '조회기간(fromDate)',
    required: true,
  })
  @IsOnlyDate()
  fromDate: string;

  @ApiProperty({
    example: '2022-07-31',
    description: '조회기간(toDate)',
    required: true,
  })
  @IsOnlyDate()
  toDate: string;
}
