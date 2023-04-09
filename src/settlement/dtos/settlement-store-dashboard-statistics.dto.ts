import { ApiProperty } from '@nestjs/swagger';

export class SettlementStoreDashboardStatisticsDTO {
  @ApiProperty({
    example: 10000000,
    description: '기간내 정산완료금액 합계',
  })
  totalSettlementPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '기간내 공제금액 합계',
  })
  totalDeductionPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '기간내 점주부담 배달료 합계',
  })
  totalOwnerDeliveryPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '기간내 중개수수료 합계',
  })
  totalAgencyPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '기간내 결제수수료 합계',
  })
  totalBillingPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '기간내 포인트 합계',
  })
  totalPointPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '기간내 사장님 쿠폰 합계',
  })
  totalOwnerCouponPrice: number;

  @ApiProperty({
    example: 80,
    description: '기간내 완료건수',
  })
  doneCount: number;
}
