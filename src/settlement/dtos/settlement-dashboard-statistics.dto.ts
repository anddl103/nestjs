import { ApiProperty } from '@nestjs/swagger';

export class SettlementDashboardStatisticsDTO {
  @ApiProperty({
    example: 10000000,
    description: '기간내 정산완료금액 합계',
  })
  totalSettlementPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '기간내 중개수수료 합계',
  })
  totalAgencyPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '기간내 공제금액 합계',
  })
  totalDeductionPrice: number;

  @ApiProperty({
    example: 80,
    description: '기간내 완료건수',
  })
  doneCount: number;
}
