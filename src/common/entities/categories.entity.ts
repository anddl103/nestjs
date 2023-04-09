import { CommonEntity } from './common.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryStoreEntity } from './category-stores.entity';

@Entity({
  name: 'category',
})
export class CategoryEntity extends CommonEntity {
  @ApiProperty({
    example: '한식',
    description: '카테고리명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @OneToOne(
    () => CategoryStoreEntity,
    (categoryStore) => categoryStore.category,
  )
  categoryStore: CategoryStoreEntity;
}
