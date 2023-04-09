import { ApiProperty } from '@nestjs/swagger';
import { SettlementSumStoreDTO } from './settlement-sum-store.dto';

export class SettlementDetailStatisticsDTO {
  @ApiProperty({
    example: {
      createdDate: '2022-07-05',
      storeId: 27,
      storeName: '미수라 도시락',
      businessName: '미수라도시락(춘천시청점)',
    },
    description: '정산합게 가게정보',
  })
  settlementSum: SettlementSumStoreDTO;

  @ApiProperty({
    example: 10000000,
    description: '정산금액(매출금액 + 공제금액 + 부가세)',
  })
  totalSettlementPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '매출금액(주문금액 + 고객부담 배달료)',
  })
  totalSalesPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '주문금액',
  })
  totalOrderPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '고객부담 배달료',
  })
  totalUserDeliveryPrice: number;

  @ApiProperty({
    example: 1000000,
    description:
      '공제금액(결제수수료 + 점주부담 배달료 + 사장님 할인 + 중개수수료 + 포인트 + 사장님 쿠폰)',
  })
  totalDeductionPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '결제수수료',
  })
  totalBillingPrice: number;

  @ApiProperty({
    example: 100000,
    description: '점주부담 배달료',
  })
  totalOwnerDeliveryPrice: number;

  @ApiProperty({
    example: 100000,
    description: '사장님 할인',
  })
  totalDiscountPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '중개수수료',
  })
  totalAgencyPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '포인트',
  })
  totalPointPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '사장님 쿠폰',
  })
  totalOwnerCouponPrice: number;

  @ApiProperty({
    example: 11000000,
    description: '보정금액-결제총액',
  })
  totalPaymentPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '보정금액-동네가게 쿠폰',
  })
  totalDnggCouponPrice: number;

  @ApiProperty({
    example: 1000000,
    description: '부가세',
  })
  totalVatPrice: number;
}
