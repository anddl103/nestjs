import {
  CreateDateColumn,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';

@Entity({
  name: 'bookmark',
})
export class BookmarkEntity {
  @ApiProperty({
    example: 1,
    description: '단골가게 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => StoreEntity, (store) => store.bookmarks)
  store: StoreEntity;
}
