import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerEntity } from './owners.entity';
import { ImageFileEntity } from './image-files.entity';

@Entity({
  name: 'owner_image',
})
export class OwnerImageEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '점주 아이디',
  })
  @Column({ type: 'int', nullable: false })
  ownerId: number;

  @ApiProperty({
    example: 1,
    description: '이미지파일 아이디',
  })
  @Column({ type: 'int', nullable: false })
  imageFileId: number;

  @ManyToOne(() => OwnerEntity, (owner) => owner.ownerImages)
  owner: OwnerEntity;

  @OneToOne(() => ImageFileEntity, (imageFile) => imageFile.ownerImage)
  @JoinColumn()
  imageFile: ImageFileEntity;
}
