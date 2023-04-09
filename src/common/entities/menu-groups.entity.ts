import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { MenuEntity } from './menus.entity';
import { StoreEntity } from './stores.entity';
import { MenuGroupType } from '../enums/menu-group-type';

@Entity({
  name: 'menu_group',
})
export class MenuGroupEntity extends CommonEntity {
  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: '치킨메뉴',
    description: '메뉴그룹명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: MenuGroupType.Normal,
    description: '분류(일반-normal|바우처-voucher)',
  })
  @Column({ type: 'varchar', nullable: true })
  type: string;

  @ApiProperty({
    example: 5,
    description: '메뉴수',
  })
  @Column({ type: 'int', nullable: true })
  menuCount: number;

  @ApiProperty({
    example: '배달 주문시, 주류메뉴는 다른 메뉴와 함께 구매해주세요',
    description: '메뉴그룹 설명',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    example: 1,
    description: '노출순서',
  })
  @Column({ type: 'int', nullable: false })
  position: number;

  @OneToMany(() => MenuEntity, (menu) => menu.menuGroup)
  menus: MenuEntity[];

  @ManyToOne(() => StoreEntity, (store) => store.menuGroups)
  store: StoreEntity;
}
