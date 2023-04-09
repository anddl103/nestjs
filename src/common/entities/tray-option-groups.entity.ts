import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { TrayEntity } from './trays.entity';
import { TrayOptionEntity } from './tray-options.entity';
import { OptionGroupEntity } from './option-groups.entity';

@Entity({
  name: 'tray_option_group',
})
export class TrayOptionGroupEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '쟁반 아이디',
  })
  @Column({ type: 'int', nullable: false })
  trayId: number;

  @ApiProperty({
    example: 1,
    description: '옵션그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  optionGroupId: number;

  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => TrayEntity, (tray) => tray.trayOptionGroups)
  tray: TrayEntity;

  @OneToMany(() => TrayOptionEntity, (trayOption) => trayOption.trayOptionGroup)
  trayOptions: TrayOptionEntity[];

  @OneToOne(
    () => OptionGroupEntity,
    (optionGroup) => optionGroup.trayOptionGroup,
  )
  @JoinColumn()
  optionGroup: OptionGroupEntity;
}
