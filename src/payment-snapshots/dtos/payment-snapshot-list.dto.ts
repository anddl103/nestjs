import { ApiProperty, PickType } from '@nestjs/swagger';
import { PaymentSnapshotEntity } from '../../common/entities/payment-snapshots.entity';

export class PaymentSnapshotListDTO extends PickType(PaymentSnapshotEntity, [
  'id',
  'createdAt',
  'status',
] as const) {
  @ApiProperty({
    example: 'CC2022419NH1F77',
    description: '주문번호, 아임포트(iamport_payment)의 merchant_uid',
  })
  orderNumber: string;

  @ApiProperty({
    example: '바른치킨 공덕자이점',
    description: '가게명',
  })
  storeName: string;

  @ApiProperty({
    example: 'delivery',
    description:
      '주문구분(delivery|package)<br>한글 텍스트 [포장 주문]에서 추후 바뀔 예정',
  })
  usingMethod: string;

  @ApiProperty({
    example: 29000,
    description: '총 결제 금액',
  })
  purchasePrice: number;

  @ApiProperty({
    example: 1000,
    description: '쿠폰 할인 금액',
  })
  couponPrice: number;

  @ApiProperty({
    example: 'dngg',
    description: '쿠폰발행자(동네가게-dngg|점주-owner)',
  })
  couponIssuer: string;

  @ApiProperty({
    example: 'card',
    description:
      '아임포트 결제수단. samsung : 삼성페이 / card : 신용카드 / trans : 계좌이체 / vbank : 가상계좌 / phone : 휴대폰 / cultureland : 문화상품권 / smartculture : 스마트문상 / booknlife : 도서문화상품권 / happymoney : 해피머니 / point : 포인트 / ssgpay : SSGPAY / lpay : LPAY / payco : 페이코 / kakaopay : 카카오페이 / tosspay : 토스 / naverpay : 네이버페이',
  })
  payMethod: string;

  @ApiProperty({
    example: 0,
    description:
      '결제취소 여부(status > paid 결제완료에만 적용)<br>isCancelled 값이 없을 경우 걸제(전체)<br>1 일 경우 결제(완료)<br>0 일 경우 결제(취소)',
  })
  isCancelled: number;
}
