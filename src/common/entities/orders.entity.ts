import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { PaymentSnapshotEntity } from './payment-snapshots.entity';
import { IamportPaymentEntity } from './iamport-payment.entity';
import { StoreEntity } from './stores.entity';
import { OrderMenuEntity } from './order-menus.entity';
import { UserEntity } from './users.entity';
import { OrderSnapshotEntity } from './order-snapshots.entity';

@Entity({
  name: 'order',
})
export class OrderEntity extends CommonEntity {
  @ApiProperty({
    example: '2022-01-06T08:29:41.334Z',
    description: '조리완료 시간',
  })
  @Column({ type: 'timestamp' })
  completedAt: Date;

  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 123,
    description: '접수번호, 가게마다 매일 오픈 후 첫주문부터 시작',
  })
  @Column({ type: 'int', nullable: false })
  receptionNumber: number;

  @ApiProperty({
    example: 'B10S01WV7R',
    description: '주문번호, 주문전체 유니크한 영어 대문자 + 숫자 조합',
  })
  @Column({ type: 'varchar', nullable: false })
  orderNumber: string;

  @ApiProperty({
    example: 'ready',
    description:
      '주문상황( 대기:ready|결제완료:payment|접수:receipt|조리중:cooking|조리완료(배달중):cooked|픽업&배달완료:pickup|취소완료:cancel )',
  })
  @Column({ type: 'varchar', nullable: true })
  orderStatus: string;

  @ApiProperty({
    example: 10,
    description:
      '주문취소( 메뉴 또는 옵션이 품절-10 | 제조지연-20 | 고객요청-30 | 기타 사유-40 | 배달불가능지역-50 | 고객정보 부정확-60 )',
  })
  @Column({ type: 'int', nullable: true })
  cancelCode: number;

  @ApiProperty({
    example: 20,
    description: '조리시간(분)',
  })
  @Column({ type: 'int', nullable: false })
  cookingTime: number;

  @ApiProperty({
    example: false,
    description: '일회용 수저/포크 필요여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isDisposable: boolean;

  @ApiProperty({
    example: '많이 주세요',
    description: '요청사항',
  })
  @Column({ type: 'varchar', nullable: true })
  request: string;

  @ApiProperty({
    example: '포장',
    description: '이용방법',
  })
  @Column({ type: 'varchar', nullable: true })
  usingMethod: string;

  @ApiProperty({
    example: 1,
    description: '1 : 결제완료, 2 : 만나서 카드결제, 3: 만나서 현금결제',
  })
  @Column({ type: 'int', nullable: false })
  payType: number;

  @ApiProperty({
    example: 'creditCard',
    description: '결제방법(신용/체크카드)',
  })
  @Column({ type: 'varchar', nullable: true })
  payment: string;

  @ApiProperty({
    example: 33000,
    description: '총 금액',
  })
  @Column({ type: 'int', nullable: false })
  totalPrice: number;

  @ApiProperty({
    example: 4000,
    description: '할인 금액',
  })
  @Column({ type: 'int', nullable: false })
  discountPrice: number;

  @ApiProperty({
    example: 0,
    description: '쿠폰 할인 금액',
  })
  @Column({ type: 'int', nullable: false })
  couponPrice: number;

  @ApiProperty({
    example: 29000,
    description: '총 결제 금액',
  })
  @Column({ type: 'int', nullable: false })
  purchasePrice: number;

  @ApiProperty({
    example: 'dngg',
    description: '쿠폰발행자(동네가게-dngg|점주-owner)',
  })
  @Column({ type: 'varchar', nullable: true })
  couponIssuer: string;

  @ApiProperty({
    example: 'road',
    description: '주소체계(지번-jibun|도로명-road)',
  })
  @Column({ type: 'varchar', nullable: false })
  type: string;

  @ApiProperty({
    example: '서울특별시 마포구 백범로 31길 21',
    description: '기본주소',
  })
  @Column({ type: 'varchar', nullable: false })
  address1: string;

  @ApiProperty({
    example: '3층 302호',
    description: '상세주소',
  })
  @Column({ type: 'varchar', nullable: true })
  address2: string;

  @OneToOne(() => IamportPaymentEntity, (impPayment) => impPayment.order)
  impPayment: IamportPaymentEntity;

  @OneToMany(
    () => PaymentSnapshotEntity,
    (paymentSnapshot) => paymentSnapshot.order,
  )
  paymentSnapshots: PaymentSnapshotEntity[];

  @OneToMany(() => OrderMenuEntity, (orderMenu) => orderMenu.order)
  orderMenus: OrderMenuEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.orders)
  store: StoreEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => OrderSnapshotEntity, (orderSnapshot) => orderSnapshot.order)
  orderSnapshots: OrderSnapshotEntity[];
}
