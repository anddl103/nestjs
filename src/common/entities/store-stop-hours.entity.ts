import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreEntity } from './stores.entity';

@Entity({
  name: 'store_stop_hour',
})
export class StoreStopHourEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: true,
    description: '시간 설정 안함(설정안함-true, 설정함-false)',
  })
  @Column({ type: 'boolean', nullable: true })
  isNotSettings: boolean;

  @ApiProperty({
    example: '가게사정',
    description: '가게사정|재료소진|직접입력...',
  })
  @Column({ type: 'varchar', nullable: true })
  message: string;

  @ApiProperty({
    example: '2022-04-05',
    description: '날짜(yyyy-MM-dd)',
  })
  @Column({ type: 'date', nullable: false })
  date: string;

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

  @OneToOne(() => StoreEntity, (store) => store.storeStopHour)
  @JoinColumn()
  store: StoreEntity;
}
