import { Column, Entity, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { OptionEntity } from './options.entity';
import { MenuOptionGroupEntity } from './menu-opton-groups.entity';
import { TrayOptionGroupEntity } from './tray-option-groups.entity';

@Entity({
  name: 'option_group',
})
export class OptionGroupEntity extends CommonEntity {
  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: '필수 옵션',
    description: '옵션그룹명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: true,
    description: '옵션종류( true: 필수, false: 선택 )',
  })
  @Column({ type: 'boolean', nullable: true })
  isRequired: boolean;

  @ApiProperty({
    example: 1,
    description: '최소 옵션선택수( 필수일 경우 1, 선택일 경우 0 )',
  })
  @Column({ type: 'int', nullable: false })
  minOption: number;

  @ApiProperty({
    example: 8,
    description:
      '최대 옵션선택수( 필수일 경우 1, 선택일 경우 옵션그룹 안의 총 옵션수 이하 )',
  })
  @Column({ type: 'int', nullable: false })
  maxOption: number;

  @ApiProperty({
    example: 5,
    description: '옵션수',
  })
  @Column({ type: 'int', nullable: true })
  optionCount: number;

  @ApiProperty({
    example: 1,
    description: '노출순서',
  })
  @Column({ type: 'int', nullable: false })
  position: number;

  @OneToOne(
    () => MenuOptionGroupEntity,
    (menuOptionGroup) => menuOptionGroup.optionGroup,
  )
  menuOptionGroup: MenuOptionGroupEntity;

  @OneToMany(() => OptionEntity, (option) => option.optionGroup)
  options: OptionEntity[];

  @OneToOne(
    () => TrayOptionGroupEntity,
    (trayOptionGroup) => trayOptionGroup.optionGroup,
  )
  trayOptionGroup: TrayOptionGroupEntity;
}
