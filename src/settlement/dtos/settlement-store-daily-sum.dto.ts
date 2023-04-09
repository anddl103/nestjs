import { ApiProperty } from '@nestjs/swagger';

export class SettlementStoreDailySumDTO {
  @ApiProperty({
    example: '2022-09-01',
    description: '일자',
  })
  sumDate: string;

  @ApiProperty({
    example: 10000000,
    description: '일별 정산완료금액',
  })
  dailySettlementPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '일별 공제금액',
  })
  dailyDeductionPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '일별 점주부담 배달료',
  })
  dailyOwnerDeliveryPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '일별 중개수수료',
  })
  dailyAgencyPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '일별 결제수수료',
  })
  dailyBillingPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '일별 포인트',
  })
  dailyPointPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '일별 사장님 쿠폰',
  })
  dailyOwnerCouponPrice: number;

  @ApiProperty({
    example: 80,
    description: '일별 완료건수',
  })
  dailyDoneCount: number;
}
