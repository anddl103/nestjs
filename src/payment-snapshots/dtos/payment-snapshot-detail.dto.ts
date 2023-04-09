import { ApiProperty, PickType } from '@nestjs/swagger';
import { PaymentSnapshotEntity } from '../../common/entities/payment-snapshots.entity';

export class PaymentSnapshotDetailDTO extends PickType(PaymentSnapshotEntity, [
  'id',
  'createdAt',
  'status',
] as const) {
  @ApiProperty({
    example: {
      createdAt: '2022-06-07T05:37:33.216Z',
      userId: 121,
      storeId: 27,
      orderNumber: 'CC2022431NT63A2',
      cookingTime: 30,
      request: '매콤하게 부탁드려요. 아주 맵게!',
      usingMethod: 'delivery',
      purchasePrice: 19710,
      couponPrice: 1000,
      couponIssuer: 'dngg',
      orderStatus: 'cancel',
      address1: '주문자 address1',
      address2: '주문자 address2',
      impPayment: {
        payMethod: 'card',
        cancelReason: '고객 요청으로 인해 취소 처리합니다.',
      },
      store: {
        name: '바른치킨 공덕파크자이점',
        owner: {
          businessName: '바른치킨공덕파크자이점',
        },
      },
      user: {
        phoneNumber: '010-1111-2223',
        fullName: 'kimfood',
      },
      orderMenus: [
        {
          number: 1,
          name: '대세레드 (매운강도:중)',
          orderMenuPrice: {
            name: null,
            discount: 10,
            price: 21900,
          },
        },
      ],
    },
    description: '주문 결제 정보',
  })
  order: object;

  @ApiProperty({
    example: {
      username: 'kimwon@foodnet24.com',
      fullName: '김관리',
    },
    description: 'CMS 직접취소 작성자 정보',
  })
  createdBy: object;
}
