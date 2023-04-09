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
import { CommonEntity } from './common.entity';
import { TrayOptionGroupEntity } from './tray-option-groups.entity';
import { OptionEntity } from './options.entity';

@Entity({
  name: 'tray_option',
})
export class TrayOptionEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '쟁반 옵션그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  trayOptionGroupId: number;

  @ApiProperty({
    example: 1,
    description: '옵션 아이디',
  })
  @Column({ type: 'int', nullable: false })
  optionId: number;

  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(
    () => TrayOptionGroupEntity,
    (trayOptionGroup) => trayOptionGroup.trayOptions,
  )
  trayOptionGroup: TrayOptionGroupEntity;

  @OneToOne(() => OptionEntity, (option) => option.trayOption)
  @JoinColumn()
  option: OptionEntity;
}
