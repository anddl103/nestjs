import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { MenuEntity } from './menus.entity';
import { StoreEntity } from './stores.entity';

@Entity({
  name: 'menu_signature',
})
export class MenuSignatureEntity extends CommonEntity {
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
    description: '노출순서',
  })
  @Column({ type: 'int', nullable: false })
  position: number;

  @OneToOne(() => MenuEntity, (menu) => menu.menuSignature)
  @JoinColumn()
  menu: MenuEntity;

  @ManyToOne(() => StoreEntity, (store) => store.menuSignatures)
  store: StoreEntity;
}
