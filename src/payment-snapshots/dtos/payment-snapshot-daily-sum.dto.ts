import { ApiProperty } from '@nestjs/swagger';

export class PaymentSnapshotDailySumDTO {
  @ApiProperty({
    example: '2022-09-01',
    description: '일자',
  })
  sumDate: string;

  @ApiProperty({
    example: 10000000,
    description: '일별 결제전체금액',
  })
  dailyAllPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '일별 결제완료금액',
  })
  dailyPaidPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '일별 결제취소금액',
  })
  dailyCancelledPrice: number;

  @ApiProperty({
    example: 80,
    description: '일별 결제전체건수',
  })
  dailyAllCount: number;

  @ApiProperty({
    example: 80,
    description: '일별 결제완료건수',
  })
  dailyPaidCount: number;

  @ApiProperty({
    example: 20,
    description: '일별 결제취소건수',
  })
  dailyCancelledCount: number;
}
