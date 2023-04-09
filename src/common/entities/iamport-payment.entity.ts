import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { OrderEntity } from './orders.entity';

@Entity({
  name: 'iamport_payment',
})
export class IamportPaymentEntity extends CommonEntity {
  @ApiProperty({
    example: 'cPS9MtsAQTSpTmC4PrsHz',
    description: '아임포트 결제 고유 UID',
  })
  @Column({ type: 'varchar', nullable: false })
  impUid: string;

  @ApiProperty({
    example: 'QTSpTmC4PrsHz',
    description: '가맹점에서 전달한 거래 고유 UID',
  })
  @Column({ type: 'varchar', nullable: false })
  merchantUid: string;

  @ApiProperty({
    example: 'card',
    description:
      'samsung : 삼성페이 / card : 신용카드 / trans : 계좌이체 / vbank : 가상계좌 / phone : 휴대폰 / cultureland : 문화상품권 / smartculture : 스마트문상 / booknlife : 도서문화상품권 / happymoney : 해피머니 / point : 포인트 / ssgpay : SSGPAY / lpay : LPAY / payco : 페이코 / kakaopay : 카카오페이 / tosspay : 토스 / naverpay : 네이버페이',
  })
  @Column({ type: 'varchar', nullable: false })
  payMethod: string;

  @ApiProperty({
    example: 'mobile',
    description:
      '결제가 발생된 경로. pc:(인증방식)PC결제, mobile:(인증방식)모바일결제, api:정기결제 또는 비인증방식결제 = [pc, mobile, api]',
  })
  @Column({ type: 'varchar', nullable: false })
  channel: string;

  @ApiProperty({
    example: 'inicis',
    description: 'PG사 명칭. inicis(이니시스) / nice(나이스정보통신)',
  })
  @Column({ type: 'varchar', nullable: true })
  pgProvider: string;

  @ApiProperty({
    example: 'kakaopay',
    description: '허브형결제 PG사 명칭. chai(차이) / kakaopay(카카오페이)',
  })
  @Column({ type: 'varchar', nullable: true })
  embPgProvider: string;

  @ApiProperty({
    example: 'AAAAAAA',
    description: 'PG사 승인정보',
  })
  @Column({ type: 'varchar', nullable: true })
  pgTid: string;

  @ApiProperty({
    example: 'AWDFSASDF',
    description: '거래가 처리된 PG사 상점아이디',
  })
  @Column({ type: 'varchar', nullable: true })
  pgId: string;

  @ApiProperty({
    example: 'kakaopay',
    description: '에스크로결제 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  escrow: boolean;

  @ApiProperty({
    example: 'kakaopay',
    description: '카드사 승인정보(계좌이체/가상계좌는 값 없음)',
  })
  @Column({ type: 'varchar', nullable: true })
  applyNum: string;

  @ApiProperty({
    example: 'kakaopay',
    description: '은행 표준코드 - (금융결제원기준)',
  })
  @Column({ type: 'varchar', nullable: true })
  bankCode: string;

  @ApiProperty({
    example: '국민은행',
    description: '은행 명칭 - (실시간계좌이체 결제 건의 경우)',
  })
  @Column({ type: 'varchar', nullable: true })
  bankName: string;

  @ApiProperty({
    example: 'kakaopay',
    description:
      '카드사 코드번호(금융결제원 표준코드번호) = [361(BC카드), 364(광주카드), 365(삼성카드), 366(신한카드), 367(현대카드), 368(롯데카드), 369(수협카드), 370(씨티카드), 371(NH카드), 372(전북카드), 373(제주카드), 374(하나SK카드), 381(KB국민카드), 041(우리카드), 071(우체국)]',
  })
  @Column({ type: 'varchar', nullable: true })
  cardCode: string;

  @ApiProperty({
    example: '신한카드',
    description: '카드사 명칭 - (신용카드 결제 건의 경우)',
  })
  @Column({ type: 'varchar', nullable: true })
  cardName: string;

  @ApiProperty({
    example: '신한카드',
    description: '할부개월 수(0이면 일시불)',
  })
  @Column({ type: 'int', nullable: true })
  cardQuota: number;

  @ApiProperty({
    example: '신한카드',
    description:
      '결제에 사용된 마스킹된 카드번호. 7~12번째 자리를 마스킹하는 것이 일반적이지만, PG사의 정책/설정에 따라 다소 차이가 있을 수 있음',
  })
  @Column({ type: 'varchar', nullable: true })
  cardNumber: string;

  @ApiProperty({
    example: '0',
    description:
      '카드유형. (주의)해당 정보를 제공하지 않는 일부 PG사의 경우 null 로 응답됨(ex. JTNet, 이니시스-빌링) = [null, 0(신용카드), 1(체크카드)]',
  })
  @Column({ type: 'int', nullable: true })
  cardType: number;

  @ApiProperty({
    example: '신한카드',
    description: '가상계좌 은행 표준코드 - (금융결제원기준)',
  })
  @Column({ type: 'varchar', nullable: true })
  vbankCode: string;

  @ApiProperty({
    example: '국민은행',
    description: '입금받을 가상계좌 은행명',
  })
  @Column({ type: 'varchar', nullable: true })
  vbankName: string;

  @ApiProperty({
    example: '00000-00-0000000',
    description: '입금받을 가상계좌 계좌번호',
  })
  @Column({ type: 'varchar', nullable: true })
  vbankNum: string;

  @ApiProperty({
    example: '예금주명 은행',
    description: '입금받을 가상계좌 예금주',
  })
  @Column({ type: 'varchar', nullable: true })
  vbankHolder: string;

  @ApiProperty({
    example: '17845121',
    description: '입금받을 가상계좌 마감기한 UNIX timestamp',
  })
  @Column({ type: 'int', nullable: true })
  vbankDate: number;

  @ApiProperty({
    example: '17845121',
    description: '가상계좌 생성 시각 UNIX timestamp',
  })
  @Column({ type: 'int', nullable: true })
  vbankIssuedAt: number;

  @ApiProperty({
    example: '주문명칭',
    description: '주문명칭',
  })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ApiProperty({
    example: '29700',
    description: '주문(결제)금액',
  })
  @Column({ type: 'int', nullable: true })
  amount: number;

  @ApiProperty({
    example: '29700',
    description: '결제취소금액',
  })
  @Column({ type: 'int', nullable: true })
  cancelAmount: number;

  @ApiProperty({
    example: 'KRW',
    description: '결제승인화폐단위(KRW:원, USD:미화달러, EUR:유로)',
  })
  @Column({ type: 'varchar', nullable: true })
  currency: string;

  @ApiProperty({
    example: '주문자',
    description: '주문자명',
  })
  @Column({ type: 'varchar', nullable: true })
  buyerName: string;

  @ApiProperty({
    example: 'abc@ddng.kr',
    description: '주문자 Email주소',
  })
  @Column({ type: 'varchar', nullable: true })
  buyerEmail: string;

  @ApiProperty({
    example: '010-0000-0000',
    description: '주문자 전화번호',
  })
  @Column({ type: 'varchar', nullable: true })
  buyerTel: string;

  @ApiProperty({
    example: '춘천...',
    description: '주문자 주소',
  })
  @Column({ type: 'varchar', nullable: true })
  buyerAddr: string;

  @ApiProperty({
    example: '000-000',
    description: '주문자 우편번호',
  })
  @Column({ type: 'varchar', nullable: true })
  buyerPostcode: string;

  @ApiProperty({
    example: '{...}',
    description: '가맹점에서 전달한 custom data. JSON string으로 전달',
  })
  @Column({ type: 'varchar', nullable: true })
  customData: string;

  @ApiProperty({
    example: 'S',
    description: '구매자가 결제를 시작한 단말기의 UserAgent 문자열',
  })
  @Column({ type: 'varchar', nullable: true })
  userAgent: string;

  @ApiProperty({
    example: 'ready',
    description:
      '결제상태. ready:미결제, paid:결제완료, cancelled:결제취소, failed:결제실패 = [ready, paid, cancelled, failed]',
  })
  @Column({ type: 'varchar', nullable: true })
  status: string;

  @ApiProperty({
    example: '17845121',
    description:
      '결제시작시점 UNIX timestamp. IMP.request_pay() 를 통해 결제창을 최초 오픈한 시각',
  })
  @Column({ type: 'int', nullable: true })
  startedAt: number;

  @ApiProperty({
    example: '17845121',
    description: '결제완료시점 UNIX timestamp. 결제완료가 아닐 경우 0',
  })
  @Column({ type: 'int', nullable: true })
  paidAt: number;

  @ApiProperty({
    example: '17845121',
    description: '결제실패시점 UNIX timestamp. 결제실패가 아닐 경우 0',
  })
  @Column({ type: 'int', nullable: true })
  failedAt: number;

  @ApiProperty({
    example: '17845121',
    description: '결제취소시점 UNIX timestamp. 결제취소가 아닐 경우 0',
  })
  @Column({ type: 'int', nullable: true })
  cancelledAt: number;

  @ApiProperty({
    example: '...',
    description: '결제실패 사유',
  })
  @Column({ type: 'varchar', nullable: true })
  failReason: string;

  @ApiProperty({
    example: '...',
    description: '결제취소 사유',
  })
  @Column({ type: 'varchar', nullable: true })
  cancelReason: string;

  @ApiProperty({
    example: 'http://...',
    description: '신용카드 매출전표 확인 URL',
  })
  @Column({ type: 'varchar', nullable: true })
  receiptUrl: string;

  @ApiProperty({
    example: 'http://...',
    description: '신용카드 매출전표 확인 URL',
  })
  @Column({ type: 'boolean', nullable: true })
  cashReceiptIssued: boolean;

  @ApiProperty({
    example: '...',
    description:
      '해당 결제처리에 사용된 customer_uid. 결제창을 통해 빌링키 발급 성공한 결제건의 경우 요청된 customer_uid 값을 응답합니다.',
  })
  @Column({ type: 'varchar', nullable: true })
  customerUid: string;

  @ApiProperty({
    example: '...',
    description:
      'customer_uid가 결제처리에 사용된 상세 용도.(null:일반결제, issue:빌링키 발급, payment:결제, payment.scheduled:예약결제 = [issue, payment, payment.scheduled]',
  })
  @Column({ type: 'varchar', nullable: true })
  customerUidUsage: string;

  @OneToOne(() => OrderEntity, (order) => order.impPayment)
  @JoinColumn({ name: 'merchant_uid', referencedColumnName: 'orderNumber' })
  order: OrderEntity;
}
