import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'settlement_fee',
})
export class SettlementFeeEntity {
  @ApiProperty({
    example: 1,
    description: '정산수수료 아이디',
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
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1.0,
    description: '입점수수료(퍼센티지)',
  })
  @Column({ type: 'float', nullable: false })
  admission: number;

  @ApiProperty({
    example: 3.0,
    description: '중개수수료(퍼센티지)',
  })
  @Column({ type: 'float', nullable: false })
  agency: number;

  @ApiProperty({
    example: 3.2,
    description: '결제수수료(퍼센티지)',
  })
  @Column({ type: 'float', nullable: false })
  billing: number;

  @ApiProperty({
    example: 3.0,
    description: '배달수수료(퍼센티지)',
  })
  @Column({ type: 'float', nullable: false })
  delivery: number;
}
