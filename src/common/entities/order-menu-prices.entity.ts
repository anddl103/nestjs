import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderMenuEntity } from './order-menus.entity';

@Entity({
  name: 'order_menu_price',
})
export class OrderMenuPriceEntity {
  @ApiProperty({
    example: 1,
    description: '주문메뉴가격 아이디',
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
    description: '메뉴가격 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuPriceId: number;

  @ApiProperty({
    example: '1000cc',
    description: '메뉴가격명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: 0,
    description: '할인율(0 ~ 99)',
  })
  @Column({ type: 'int', nullable: false })
  discount: number;

  @ApiProperty({
    example: 16900,
    description: '메뉴 가격',
  })
  @Column({ type: 'int', nullable: false })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => OrderMenuEntity, (orderMenu) => orderMenu.orderMenuPrice)
  @JoinColumn()
  orderMenu: OrderMenuEntity;
}
