import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { StoreEntity } from './stores.entity';
import { TrayOptionGroupEntity } from './tray-option-groups.entity';

@Entity({
  name: 'tray',
})
export class TrayEntity extends CommonEntity {
  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @ApiProperty({
    example: 1,
    description: '금액 아이디',
  })
  @Column({ type: 'int', nullable: false })
  priceId: number;

  @ApiProperty({
    example: 1,
    description: '개수',
  })
  @Column({ type: 'int', nullable: false })
  number: number;

  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => StoreEntity, (store) => store.trays)
  store: StoreEntity;

  @OneToMany(
    () => TrayOptionGroupEntity,
    (trayOptionGroup) => trayOptionGroup.tray,
  )
  trayOptionGroups: TrayOptionGroupEntity[];
}
