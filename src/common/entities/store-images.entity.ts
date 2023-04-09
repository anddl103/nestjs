import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';
import { ImageFileEntity } from './image-files.entity';

@Entity({
  name: 'store_image',
})
export class StoreImageEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '이미지파일 아이디',
  })
  @Column({ type: 'int', nullable: false })
  imageFileId: number;

  @ManyToOne(() => StoreEntity, (store) => store.storeImages)
  store: StoreEntity;

  @OneToOne(() => ImageFileEntity, (imageFile) => imageFile.storeImage)
  @JoinColumn()
  imageFile: ImageFileEntity;
}
