import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { OptionGroupEntity } from './option-groups.entity';
import { TrayOptionEntity } from './tray-options.entity';

@Entity({
  name: 'option',
})
export class OptionEntity extends CommonEntity {
  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '옵션그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  optionGroupId: number;

  @ApiProperty({
    example: '포장무',
    description: '옵션명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: 500,
    description: '옵션 가격',
  })
  @Column({ type: 'int', nullable: false })
  price: number;

  @ApiProperty({
    example: false,
    description: '품절여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isSoldout: boolean;

  @ApiProperty({
    example: 1,
    description: '노출순서',
  })
  @Column({ type: 'int', nullable: false })
  position: number;

  @ManyToOne(() => OptionGroupEntity, (optionGroup) => optionGroup.options)
  optionGroup: OptionGroupEntity;

  @OneToOne(() => TrayOptionEntity, (trayOption) => trayOption.option)
  trayOption: TrayOptionEntity;
}
