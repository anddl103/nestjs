import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { LocalDateTimeTransformer } from '../transformers/local-date-time-transformer';
import { CommonEntity } from './common.entity';
import { OwnerEntity } from './owners.entity';

@Entity({
  name: 'event',
})
export class EventEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '작성자(운영자) 아이디',
  })
  @Column({ type: 'int', nullable: false })
  ownerId: number;

  @ApiProperty({
    example: '제목입니다....',
    description: '제목',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({
    example: '<p>내용입니다....</p>',
    description: '내용',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  body: string;

  @ApiProperty({
    example: '2022-06-01 10:00:00',
    description: '시작일',
  })
  @Column({
    type: 'timestamp',
    transformer: new LocalDateTimeTransformer(),
    nullable: true,
  })
  startedAt: Date;

  @ApiProperty({
    example: '2022-08-31 20:00:00',
    description: '종료일',
  })
  @Column({
    type: 'timestamp',
    transformer: new LocalDateTimeTransformer(),
    nullable: true,
  })
  endedAt: Date;

  @ApiProperty({
    example: true,
    description: '노출 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isDisplayed: boolean;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '배너(이미지) URL',
  })
  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일(이미지) URL',
  })
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @ApiProperty({
    example: 0,
    description: '조회수',
  })
  @Column({ type: 'int', nullable: true })
  hitCount: number;

  @ManyToOne(() => OwnerEntity, (owner) => owner.events)
  owner: OwnerEntity;
}
