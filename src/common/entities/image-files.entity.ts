import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { OwnerImageEntity } from './owner-images.entity';
import { StoreImageEntity } from './store-images.entity';

@Entity({
  name: 'image_file',
})
export class ImageFileEntity extends CommonEntity {
  @ApiProperty({
    example: 'stores',
    description: '폴더명',
  })
  @Column({ type: 'varchar', nullable: true })
  folder: string;

  @ApiProperty({
    example: 'aaa.jpg',
    description: '파일명',
  })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ApiProperty({
    example: 'https://...',
    description: '파일 url',
  })
  @Column({ type: 'varchar', nullable: true })
  url: string;

  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '점주 아이디',
  })
  @Column({ type: 'int', nullable: true })
  ownerId: number;

  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: true })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '메뉴 아이디',
  })
  @Column({ type: 'int', nullable: true })
  menuId: number;

  @OneToOne(() => OwnerImageEntity, (ownerImage) => ownerImage.imageFile)
  ownerImage: OwnerImageEntity;

  @OneToOne(() => StoreImageEntity, (storeImage) => storeImage.imageFile)
  storeImage: StoreImageEntity;
}
