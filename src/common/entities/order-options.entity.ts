import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderOptionGroupEntity } from './order-option-groups.entity';

@Entity({
  name: 'order_option',
})
export class OrderOptionEntity {
  @ApiProperty({
    example: 1,
    description: '주문옵션 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '주문옵션그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  orderOptionGroupId: number;

  @ApiProperty({
    example: 1,
    description: '옵션 아이디',
  })
  @Column({ type: 'int', nullable: false })
  optionId: number;

  @ApiProperty({
    example: '포장무',
    description: '옵션명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: 500,
    description: '옵션 가격',
  })
  @Column({ type: 'int', nullable: false })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(
    () => OrderOptionGroupEntity,
    (orderOptionGroup) => orderOptionGroup.orderOptions,
  )
  orderOptionGroup: OrderOptionGroupEntity;
}
