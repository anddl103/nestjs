import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';

@Entity({
  name: 'store_break_hour',
})
export class StoreBreakHourEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 10,
    description: '시작시간(시)',
  })
  @Column({ type: 'int', nullable: true })
  startHour: number;

  @ApiProperty({
    example: 30,
    description: '시작시간(분)',
  })
  @Column({ type: 'int', nullable: true })
  startMin: number;

  @ApiProperty({
    example: 21,
    description: '종료시간(시)',
  })
  @Column({ type: 'int', nullable: true })
  endHour: number;

  @ApiProperty({
    example: 30,
    description: '종료시간(분)',
  })
  @Column({ type: 'int', nullable: true })
  endMin: number;

  @OneToOne(() => StoreEntity, (store) => store.storeBreakHour)
  @JoinColumn()
  store: StoreEntity;
}
