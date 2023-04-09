import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EventFormDTO {
  @ApiProperty({
    example: '동네가게 서비스 오픈 이벤트 제목',
    description: '이벤트 제목',
    required: true,
  })
  @IsNotEmpty({ message: '이벤트 제목을 작성해주세요.' })
  title: string;

  @ApiProperty({
    example: '<h1>이벤트 내용</h1><h2>이벤트 내용</h2><h3>이벤트 내용</h3>',
    description: '이벤트 내용',
    required: true,
  })
  @IsNotEmpty({ message: '이벤트 내용을 작성해주세요.' })
  body: string;

  @ApiProperty({
    example: '2022-06-01 10:00:00',
    description: '시작일',
  })
  @Type(() => Date)
  @IsNotEmpty({ message: '시작일을 설정해주세요.' })
  startedAt: Date;

  @ApiProperty({
    example: '2022-08-31 20:00:00',
    description: '종료일',
  })
  @Type(() => Date)
  @IsNotEmpty({ message: '종료일을 설정해주세요.' })
  endedAt: Date;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '이벤트 배너 이미지 URL',
    required: true,
  })
  @IsNotEmpty({ message: '배너 이미지 URL을 입력해주세요.' })
  bannerUrl: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일 이미지 URL',
    required: false,
  })
  @IsOptional()
  imageUrl: string;
}
