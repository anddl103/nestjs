import { ApiProperty } from '@nestjs/swagger';
import { SettlementDailySumDTO } from './settlement-daily-sum.dto';
import { SettlementDashboardStatisticsDTO } from './settlement-dashboard-statistics.dto';

export class SettlementDashboardDTO {
  @ApiProperty({
    example: {
      totalSettlementPrice: 10000000,
      totalSalesPrice: 9000000,
      totalDeductionPrice: 1000000,
      totalVatPrice: 100000,
      readyCount: 100,
      doneCount: 90,
      pendingCount: 10,
    },
    description: '정산 전체 통계',
  })
  statistics: SettlementDashboardStatisticsDTO;

  @ApiProperty({
    example: [
      {
        sumDate: '2022-09-01',
        dailyAllPrice: 1000000,
        dailyPaidPrice: 900000,
        dailyCancelledPrice: 100000,
        dailyAllCount: 10,
        dailyPaidCount: 9,
        dailyCancelledCount: 1,
      },
    ],
    description: '정산 일별 통계',
  })
  dailySums: SettlementDailySumDTO[];
}
