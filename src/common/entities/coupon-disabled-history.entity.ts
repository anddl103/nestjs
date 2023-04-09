import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'coupon_disabled_history',
})
export class CouponDisabledHistoryEntity {
  @ApiProperty({
    example: 1,
    description: '내부 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 열이 추가된 시각을 자동으로 기록
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '3',
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @ApiProperty({
    example: 1,
    description: '쿠폰 아이디',
  })
  @Column({ type: 'int', nullable: false })
  couponId: number;

  @ApiProperty({
    example: false,
    description: '비활성 여부(발급중지여부)',
  })
  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;
}
