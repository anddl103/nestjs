import { ApiProperty } from '@nestjs/swagger';

export class SettlementSumStatisticsDTO {
  @ApiProperty({
    example: 11000000,
    description: '매출금액',
  })
  totalSalesAmount: number;

  @ApiProperty({
    example: 10000000,
    description: '정산금액',
  })
  totalSettlementAmount: number;

  @ApiProperty({
    example: 1000000,
    description: '공제금액',
  })
  totalDeductionAmount: number;

  @ApiProperty({
    example: 1000000,
    description: '부가세',
  })
  totalVatAmount: number;

  @ApiProperty({
    example: 80,
    description: '대기건수',
  })
  readyCount: number;

  @ApiProperty({
    example: 80,
    description: '완료건수',
  })
  doneCount: number;

  @ApiProperty({
    example: 20,
    description: '보류건수',
  })
  pendingCount: number;
}
