import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class CommonEntity {
  //@IsUUID()
  //@PrimaryGeneratedColumn('uuid')
  //id: string;
  @ApiProperty({
    example: 1,
    description: '내부 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 열이 추가된 시각을 자동으로 기록
  @ApiProperty({
    example: '2022-03-10T05:37:33.216Z',
    description: '생성 일자',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2022-03-10T05:37:33.216Z',
    description: '수정 일자',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Soft Delete : 기존에는 null, 삭제시에 timestamp를 찍는다.
  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date | null;
}
