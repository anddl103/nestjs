import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity({
  name: 'push_send_queue',
})
export class PushSendQueueEntity extends CommonEntity {
  @ApiProperty({
    example: 'cPS9MtsAQTSpTmC4PrsHzc:APA91bEZN....',
    description: '디바이스 토큰',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  deviceToken: string;

  @ApiProperty({
    example: '제목입니다....',
    description: '제목',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({
    example: '내용입니다....',
    description: '내용',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  body: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '이미지 URL',
  })
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @ApiProperty({
    example: 'true',
    description: '성공여부',
  })
  @IsNumber()
  @Column({ type: 'int', nullable: false, default: 0 })
  retryCount: number;

  @ApiProperty({
    example: 'messaging/invalid-argument',
    description: '상태( ready:준비, failure:실패, success:성공 )',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  status: string;
}
