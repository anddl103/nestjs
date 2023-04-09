import {
  CreateDateColumn,
  Column,
  JoinColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { MenuEntity } from './menus.entity';
import { OptionGroupEntity } from './option-groups.entity';

@Entity({
  name: 'menu_option_group',
})
export class MenuOptionGroupEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @ApiProperty({
    example: 1,
    description: '옵션그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  optionGroupId: number;

  @ManyToOne(() => MenuEntity, (menu) => menu.menuOptionGroups)
  menu: MenuEntity;

  @OneToOne(
    () => OptionGroupEntity,
    (optionGroup) => optionGroup.menuOptionGroup,
  )
  @JoinColumn()
  optionGroup: OptionGroupEntity;
}
