import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'settlement',
})
export class SettlementEntity {
  @ApiProperty({
    example: 1,
    description: '정산 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2022-05-30T05:37:33.216Z',
    description: '생성일시',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2022-05-30T05:37:33.216Z',
    description: '완료일시',
  })
  @Column({ type: 'timestamp', nullable: true })
  doneAt: Date;

  @ApiProperty({
    example: '2022-07-05',
    description: '생성일(yyyy-MM-dd)',
  })
  @Column({ type: 'varchar', nullable: false })
  createdDate: string;

  @ApiProperty({
    example: '2022-07-12',
    description: '대기일(yyyy-MM-dd)',
  })
  @Column({ type: 'varchar', nullable: true })
  readyDate: string;

  @ApiProperty({
    example: '2022-07-12',
    description: '예정일(yyyy-MM-dd)',
  })
  @Column({ type: 'varchar', nullable: true })
  expectedDate: string;

  @ApiProperty({
    example: '2022-07-12',
    description: '완료일(yyyy-MM-dd)',
  })
  @Column({ type: 'varchar', nullable: true })
  doneDate: string;

  @ApiProperty({
    example: '2022-07-12',
    description: '보류일(yyyy-MM-dd)',
  })
  @Column({ type: 'varchar', nullable: true })
  pendingDate: string;

  @ApiProperty({
    example: 1,
    description: '정산합계 아이디',
  })
  @Column({ type: 'int', nullable: true })
  settlementSumId: number;

  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 'THE더 가득담은 1인 김치찜',
    description: '가게명',
  })
  @Column({ type: 'varchar', nullable: true })
  storeName: string;

  @ApiProperty({
    example: '메이크어딜리버리 사당점',
    description: '상호명',
  })
  @Column({ type: 'varchar', nullable: true })
  businessName: string;

  @ApiProperty({
    example: 1,
    description: '결제현황 아이디',
  })
  @Column({ type: 'int', nullable: false })
  paymentSnapshotId: number;

  @ApiProperty({
    example: '2022-05-30T05:37:33.216Z',
    description: '결제현황 생성 일자',
  })
  @Column({ type: 'timestamp', nullable: false })
  paymentSnapshotDate: Date;

  @ApiProperty({
    example: 'paid',
    description:
      '구분(아임포트 결제상태). paid:결제완료, cancelled:결제취소 = [paid, cancelled]',
  })
  @Column({ type: 'varchar', nullable: false })
  paymentSnapshotStatus: string;

  @ApiProperty({
    example: 'card',
    description:
      'samsung : 삼성페이 / card : 신용카드 / trans : 계좌이체 / vbank : 가상계좌 / phone : 휴대폰 / cultureland : 문화상품권 / smartculture : 스마트문상 / booknlife : 도서문화상품권 / happymoney : 해피머니 / point : 포인트 / ssgpay : SSGPAY / lpay : LPAY / payco : 페이코 / kakaopay : 카카오페이 / tosspay : 토스 / naverpay : 네이버페이',
  })
  @Column({ type: 'varchar', nullable: false })
  payMethod: string;

  @ApiProperty({
    example: 'CC2022524NA502J',
    description: '주문번호',
  })
  @Column({ type: 'varchar', nullable: false })
  orderNumber: string;

  @ApiProperty({
    example: 33000,
    description: '매출금액(주문금액+고객부담 배달료)',
  })
  @Column({ type: 'int', nullable: false })
  salesPrice: number;

  @ApiProperty({
    example: 33000,
    description: '주문금액',
  })
  @Column({ type: 'int', nullable: false })
  orderPrice: number;

  @ApiProperty({
    example: 0,
    description: '고객부담 배달료',
  })
  @Column({ type: 'int', nullable: false })
  userDeliveryPrice: number;

  @ApiProperty({
    example: 27000,
    description: '결제/취소금액(취소의 경우 -결제금액)',
  })
  @Column({ type: 'int', nullable: false })
  paymentPrice: number;

  @ApiProperty({
    example: 0,
    description: '바우처결제',
  })
  @Column({ type: 'int', nullable: true })
  voucherPrice: number;

  @ApiProperty({
    example: 20000,
    description: '정산금액(매출금액 + 공제금액 + 부가세)',
  })
  @Column({ type: 'int', nullable: false })
  settlementPrice: number;

  @ApiProperty({
    example: 7000,
    description: '공제금액',
  })
  @Column({ type: 'int', nullable: false })
  deductionPrice: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-점주부담 배달료',
  })
  @Column({ type: 'int', nullable: false })
  ownerDeliveryPrice: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-사장님 할인',
  })
  @Column({ type: 'int', nullable: false })
  discountPrice: number;

  @ApiProperty({
    example: 3000,
    description: '공제금액 상세-중개수수료',
  })
  @Column({ type: 'int', nullable: false })
  agencyPrice: number;

  @ApiProperty({
    example: 1000,
    description: '공제금액 상세-결제수수료',
  })
  @Column({ type: 'int', nullable: false })
  billingPrice: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-포인트',
  })
  @Column({ type: 'int', nullable: true })
  pointPrice: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-사장님 쿠폰',
  })
  @Column({ type: 'int', nullable: true })
  ownerCouponPrice: number;

  @ApiProperty({
    example: 0,
    description: '동네가게 쿠폰',
  })
  @Column({ type: 'int', nullable: true })
  dnggCouponPrice: number;

  @ApiProperty({
    example: 300,
    description: '부가세 = (중개수수료 + 결제수수료) * 0.1, 소수점 버림',
  })
  @Column({ type: 'int', nullable: false })
  vatPrice: number;

  @ApiProperty({
    example: 'ready',
    description: '정산상태(대기-ready|완료-done|보류-pending)',
  })
  @Column({ type: 'varchar', nullable: false })
  status: string;

  @ApiProperty({
    example: false,
    description: '결제완료일때 취소여부',
  })
  @Column({ type: 'boolean', nullable: false })
  isCancelled: boolean;
}
