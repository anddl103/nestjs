import { CommonEntity } from './common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';

@Entity({
  name: 'store_open_hour',
})
export class StoreOpenHourEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 'monday',
    description:
      '요일(monday|tuesday|wednesday|thursday|friday|saturday|sunday)',
  })
  @Column({ type: 'varchar', nullable: false })
  dayOfWeek: string;

  @ApiProperty({
    example: true,
    description: '24시간 영업 유무',
  })
  @Column({ type: 'boolean', nullable: true })
  isAllHours: boolean;

  @ApiProperty({
    example: true,
    description: '휴일 유무',
  })
  @Column({ type: 'boolean', nullable: true })
  isRestDay: boolean;

  @ApiProperty({
    example: 10,
    description: '오픈시간(시)',
  })
  @Column({ type: 'int', nullable: true })
  openHour: number;

  @ApiProperty({
    example: 30,
    description: '오픈시간(분)',
  })
  @Column({ type: 'int', nullable: true })
  openMin: number;

  @ApiProperty({
    example: 21,
    description: '마감시간(시)',
  })
  @Column({ type: 'int', nullable: true })
  closeHour: number;

  @ApiProperty({
    example: 30,
    description: '마감시간(분)',
  })
  @Column({ type: 'int', nullable: true })
  closeMin: number;

  @ManyToOne(() => StoreEntity, (store) => store.storeOpenHours)
  store: StoreEntity;
}
