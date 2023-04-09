import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'settlement_sum',
})
export class SettlementSumEntity {
  @ApiProperty({
    example: 1,
    description: '정산합계 아이디',
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
    example: '2022-007-12',
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
    example: '123-12-12345',
    description: '사업자등록번호',
  })
  @Column({ type: 'varchar', nullable: true })
  businessNumber: string;

  @ApiProperty({
    example: 10,
    description: '주문 건수',
  })
  @Column({ type: 'int', nullable: false })
  orderCount: number;

  @ApiProperty({
    example: 33000,
    description: '매출금액(주문금액+고객부담 배달료)',
  })
  @Column({ type: 'int', nullable: false })
  salesAmount: number;

  @ApiProperty({
    example: 33000,
    description: '주문금액',
  })
  @Column({ type: 'int', nullable: false })
  orderAmount: number;

  @ApiProperty({
    example: 0,
    description: '고객부담 배달료',
  })
  @Column({ type: 'int', nullable: false })
  userDeliveryAmount: number;

  @ApiProperty({
    example: 27000,
    description: '결제/취소금액',
  })
  @Column({ type: 'int', nullable: false })
  paymentAmount: number;

  @ApiProperty({
    example: 20000,
    description: '정산금액(매출금액 + 공제금액 + 부가세)',
  })
  @Column({ type: 'int', nullable: false })
  settlementAmount: number;

  @ApiProperty({
    example: 7000,
    description: '공제금액',
  })
  @Column({ type: 'int', nullable: false })
  deductionAmount: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-점주부담 배달료',
  })
  @Column({ type: 'int', nullable: false })
  ownerDeliveryAmount: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-사장님 할인',
  })
  @Column({ type: 'int', nullable: false })
  discountAmount: number;

  @ApiProperty({
    example: 1000,
    description: '공제금액 상세-중개수수료',
  })
  @Column({ type: 'int', nullable: false })
  agencyAmount: number;

  @ApiProperty({
    example: 1000,
    description: '공제금액 상세-결제수수료',
  })
  @Column({ type: 'int', nullable: false })
  billingAmount: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-포인트',
  })
  @Column({ type: 'int', nullable: true })
  pointAmount: number;

  @ApiProperty({
    example: 0,
    description: '공제금액 상세-사장님 쿠폰',
  })
  @Column({ type: 'int', nullable: true })
  ownerCouponAmount: number;

  @ApiProperty({
    example: 0,
    description: '동네가게 쿠폰',
  })
  @Column({ type: 'int', nullable: true })
  dnggCouponAmount: number;

  @ApiProperty({
    example: 300,
    description: '부가세 = (중개수수료 + 결제수수료) * 0.1, 소수점 버림',
  })
  @Column({ type: 'int', nullable: false })
  vatAmount: number;

  @ApiProperty({
    example: 'ready',
    description: '정산상태(대기-ready|완료-done|보류-pending)',
  })
  @Column({ type: 'varchar', nullable: false })
  status: string;
}
