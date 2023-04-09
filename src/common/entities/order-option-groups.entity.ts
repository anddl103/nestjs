import {
  CreateDateColumn,
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderOptionEntity } from './order-options.entity';

@Entity({
  name: 'order_option_group',
})
export class OrderOptionGroupEntity {
  @ApiProperty({
    example: 1,
    description: '주문옵션그룹 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '주문메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  orderMenuId: number;

  @ApiProperty({
    example: 1,
    description: '옵션그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  optionGroupId: number;

  @ApiProperty({
    example: '필수 옵션',
    description: '옵션그룹명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: true,
    description: '필수여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isRequired: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(
    () => OrderOptionEntity,
    (orderOption) => orderOption.orderOptionGroup,
  )
  orderOptions: OrderOptionEntity[];
}
