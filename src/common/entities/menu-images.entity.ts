import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';
import { ImageFileEntity } from './image-files.entity';
import { MenuEntity } from './menus.entity';

@Entity({
  name: 'menu_image',
})
export class MenuImageEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuId: number;

  @ApiProperty({
    example: 1,
    description: '이미지파일 아이디',
  })
  @Column({ type: 'int', nullable: false })
  imageFileId: number;

  @ManyToOne(() => MenuEntity, (menu) => menu.menuImages)
  menu: MenuEntity;

  @OneToOne(() => ImageFileEntity, (imageFile) => imageFile.storeImage)
  @JoinColumn()
  imageFile: ImageFileEntity;
}
