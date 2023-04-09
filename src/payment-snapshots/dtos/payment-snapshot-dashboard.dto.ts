import { ApiProperty } from '@nestjs/swagger';
import { PaymentSnapshotDailySumDTO } from './payment-snapshot-daily-sum.dto';
import { PaymentSnapshotStatisticsDTO } from './payment-snapshot-statistics.dto';

export class PaymentSnapshotDashboardDTO {
  @ApiProperty({
    example: {
      totalAllPrice: 10000000,
      totalPaidPrice: 9000000,
      totalCancelledPrice: 1000000,
      allCount: 100,
      paidCount: 90,
      cancelledCount: 10,
    },
    description: '결제현황 전체 통계',
  })
  statistics: PaymentSnapshotStatisticsDTO;

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
    description: '결제현황 일별 통계',
  })
  dailySums: PaymentSnapshotDailySumDTO[];
}
