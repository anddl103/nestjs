import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { OwnerEntity } from './owners.entity';

@Entity({
  name: 'notice',
})
export class NoticeEntity extends CommonEntity {
  @ApiProperty({
    example: 'user',
    description: '공지 분류(고객-user|점주-owner)',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  type: string;

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

  @ManyToOne(() => OwnerEntity, (owner) => owner.notices)
  owner: OwnerEntity;
}
