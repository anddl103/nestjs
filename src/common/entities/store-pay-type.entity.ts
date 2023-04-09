import { CommonEntity } from './common.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'store_pay_type',
})
export class StorePayTypeEntity {
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
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '결제 방법',
  })
  @Column({ type: 'int', nullable: false })
  payType: number;
}
