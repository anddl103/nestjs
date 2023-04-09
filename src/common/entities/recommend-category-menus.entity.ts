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
import { RecommendCategoryEntity } from './recommend-categories.entity';
import { MenuEntity } from './menus.entity';

@Entity({
  name: 'recommend_category_menu',
})
export class RecommendCategoryMenuEntity {
  @ApiProperty({
    example: 1,
    description: '추천 메뉴 카테고리 메뉴 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: '추천 메뉴 카테고리 아이디',
  })
  @Column({ type: 'int', nullable: false })
  recommendCategoryId: number;

  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => MenuEntity, (menu) => menu.recommendCategoryMenu)
  @JoinColumn()
  menu: MenuEntity;
}
