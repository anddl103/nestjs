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
import { MenuEntity } from './menus.entity';

@Entity({
  name: 'discount_category_menu',
})
export class DiscountCategoryMenuEntity {
  @ApiProperty({
    example: 1,
    description: '할인 음식 카테고리 메뉴 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '카테고리 아이디',
  })
  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => MenuEntity, (menu) => menu.discountCategoryMenu)
  @JoinColumn()
  menu: MenuEntity;
}
