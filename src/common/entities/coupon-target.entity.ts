import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'coupon_target',
})
export class CouponTargetEntity {
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
    example: 1,
    description: '쿠폰 아이디',
  })
  @Column({ type: 'int', nullable: true })
  couponId: number;

  @ApiProperty({
    example: 1,
    description: '대상 아이디(공통코드 아이디)',
  })
  @Column({ type: 'int', nullable: true })
  codeId: number;
}
