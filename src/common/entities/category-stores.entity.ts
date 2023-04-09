import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';
import { CategoryEntity } from './categories.entity';

@Entity({
  name: 'category_store',
})
export class CategoryStoreEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '카테고리 아이디',
  })
  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @OneToOne(() => CategoryEntity, (category) => category.categoryStore)
  @JoinColumn()
  category: CategoryEntity;

  @ManyToOne(() => StoreEntity, (store) => store.categoryStores)
  store: StoreEntity;
}
