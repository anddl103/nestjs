import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'settlement_sum_snapshot',
})
export class SettlementSumSnapshotEntity {
  @ApiProperty({
    example: 1,
    description: '정산합계현황 아이디',
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
    description: '정산합계 아이디',
  })
  @Column({ type: 'int', nullable: true })
  settlementSumId: number;

  @ApiProperty({
    example: 'ready',
    description: '정산상태(대기-ready|완료-done|보류-suspension|마감-closed)',
  })
  @Column({ type: 'varchar', nullable: false })
  status: string;
}
