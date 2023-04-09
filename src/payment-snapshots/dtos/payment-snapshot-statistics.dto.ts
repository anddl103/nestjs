import { ApiProperty } from '@nestjs/swagger';

export class PaymentSnapshotStatisticsDTO {
  @ApiProperty({
    example: 10000000,
    description: '총 결제전체금액',
  })
  totalAllPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '총 결제완료금액',
  })
  totalPaidPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '총 결제취소금액',
  })
  totalCancelledPrice: number;

  @ApiProperty({
    example: 80,
    description: '결제전체건수',
  })
  allCount: number;

  @ApiProperty({
    example: 80,
    description: '결제완료건수',
  })
  paidCount: number;

  @ApiProperty({
    example: 20,
    description: '결제취소건수',
  })
  cancelledCount: number;
}
