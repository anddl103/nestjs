import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity({
  name: 'iamport_payment_cancel',
})
export class IamportPaymentCancelEntity extends CommonEntity {
  @ApiProperty({
    example: 'AAAAAAA',
    description: 'PG사 승인정보',
  })
  @Column({ type: 'varchar', nullable: true })
  pgTid: string;

  @ApiProperty({
    example: '29700',
    description: '주문(결제)금액',
  })
  @Column({ type: 'int', nullable: true })
  amount: number;

  @ApiProperty({
    example: '17845121',
    description: '결제취소된 시각 UNIX timestamp',
  })
  @Column({ type: 'int', nullable: true })
  cancelledAt: number;

  @ApiProperty({
    example: '...',
    description: '결제취소 사유',
  })
  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @ApiProperty({
    example: 'http://...',
    description:
      '취소에 대한 매출전표 확인 URL. PG사에 따라 제공되지 않는 경우도 있음',
  })
  @Column({ type: 'varchar', nullable: true })
  receiptUrl: string;
}
