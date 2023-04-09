import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderMenuPriceEntity } from './order-menu-prices.entity';
import { OrderEntity } from './orders.entity';

@Entity({
  name: 'order_menu',
})
export class OrderMenuEntity {
  @ApiProperty({
    example: 1,
    description: '주문메뉴 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '주문 아이디',
  })
  @Column({ type: 'int', nullable: false })
  orderId: number;

  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @ApiProperty({
    example: 2,
    description: '수량',
  })
  @Column({ type: 'int', nullable: false })
  number: number;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg',
    description: '음식 사진',
  })
  @Column({ type: 'varchar', nullable: false })
  menuImage: string;

  @ApiProperty({
    example: '양념치킨',
    description: '메뉴명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: '현미바사삭 순살 + 바른 치즈 떡볶이',
    description: '세트구성',
  })
  @Column({ type: 'varchar', nullable: true })
  combo: string;

  @ApiProperty({
    example: '배달 주문시, 주류메뉴는 다른 메뉴와 함께 구매해주세요',
    description: '메뉴그룹 설명',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.orderMenus)
  order: OrderEntity;

  @OneToOne(
    () => OrderMenuPriceEntity,
    (orderMenuPrice) => orderMenuPrice.orderMenu,
  )
  orderMenuPrice: OrderMenuPriceEntity;
}
