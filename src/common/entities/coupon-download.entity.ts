import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CouponEntity } from './coupons.entity';

@Entity({
  name: 'coupon_download',
})
export class CouponDownloadEntity {
  @ApiProperty({
    example: 1,
    description: '내부 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 열이 추가된 시각을 자동으로 기록
  @ApiProperty({
    example: '2022-03-10T05:37:33.216Z',
    description: '생성 일자',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2022-03-10T05:37:33.216Z',
    description: '사용 일자',
  })
  usedAt: Date;

  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '쿠폰 아이디',
  })
  @Column({ type: 'int', nullable: true })
  couponId: number;

  @ApiProperty({
    example: 1,
    description: '주문 아이디',
  })
  @Column({ type: 'int', nullable: true })
  orderId: number;

  @ApiProperty({
    example: false,
    description: '사용 여부',
  })
  @Column({ type: 'boolean', default: false })
  isUse: boolean;

  @ManyToOne(() => CouponEntity, (coupon) => coupon.couponDownload)
  coupon: CouponEntity;
}
