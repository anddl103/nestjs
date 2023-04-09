import { ApiProperty } from '@nestjs/swagger';
import { SettlementStoreDailySumDTO } from './settlement-store-daily-sum.dto';
import { SettlementStoreDashboardStatisticsDTO } from './settlement-store-dashboard-statistics.dto';

export class SettlementStoreDashboardDTO {
  @ApiProperty({
    example: {
      totalSettlementPrice: 10000000,
      totalDeductionPrice: 1000000,
      totalUserDeliveryPrice: 1000000,
      totalAgencyPrice: 100000,
      totalBillingPrice: 100000,
      totalPointPrice: 100000,
      totalOwnerCouponPrice: 100000,
      doneCount: 90,
    },
    description: '점주 정산 전체 통계',
  })
  statistics: SettlementStoreDashboardStatisticsDTO;

  @ApiProperty({
    example: [
      {
        sumDate: '2022-09-01',
        dailySettlementPrice: 900000,
        dailyDeductionPrice: 100000,
        dailyOwnerDeliveryPrice: 20000,
        dailyAgencyPrice: 20000,
        dailyBillingPrice: 20000,
        dailyPointPrice: 20000,
        dailyOwnerCouponPrice: 20000,
        dailyDoneCount: 10,
      },
    ],
    description: '점주 정산 일별 통계',
  })
  dailySums: SettlementStoreDailySumDTO[];
}
