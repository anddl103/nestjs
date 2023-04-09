import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { MenuEntity } from './menus.entity';

@Entity({
  name: 'menu_price',
})
export class MenuPriceEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @ApiProperty({
    example: '1000cc',
    description: '메뉴가격명',
  })
  @Column({ type: 'varchar', nullable: true })
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

  @ManyToOne(() => MenuEntity, (menu) => menu.menuPrices)
  menu: MenuEntity;
}
