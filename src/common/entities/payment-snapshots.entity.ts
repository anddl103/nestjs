import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from './orders.entity';
import { OwnerEntity } from './owners.entity';

@Entity({
  name: 'payment_snapshot',
})
export class PaymentSnapshotEntity {
  @ApiProperty({
    example: 1,
    description: '결제현황 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2022-05-30T05:37:33.216Z',
    description: '생성 일자',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: 1,
    description: '주문 아이디',
  })
  @Column({ type: 'int', nullable: false })
  orderId: number;

  @ApiProperty({
    example: 'paid',
    description:
      '구분(아임포트 결제상태). paid:결제완료, cancelled:결제취소 = [paid, cancelled]',
  })
  @Column({ type: 'varchar', nullable: false })
  status: string;

  @ApiProperty({
    example: 2,
    description: '주문취소 작성자(운영자) 아이디',
  })
  @Column({ type: 'int', nullable: true })
  ownerId: number;

  @ManyToOne(() => OrderEntity, (order) => order.paymentSnapshots)
  order: OrderEntity;

  @ManyToOne(() => OwnerEntity, (createdBy) => createdBy.paymentSnapshots)
  @JoinColumn({ name: 'owner_id' })
  createdBy: OwnerEntity;
}
