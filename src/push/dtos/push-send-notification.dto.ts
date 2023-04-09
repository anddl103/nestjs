import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PushSendNotificationDTO {
  @ApiProperty({
    example: '제목입니다',
    description: '제목',
  })
  @IsString()
  @IsNotEmpty({ message: '제목을 작성해주세요.' })
  title: string;

  @ApiProperty({
    example: '내용입니다',
    description: '내용',
  })
  @IsString()
  @IsNotEmpty({ message: '내용을 작성해주세요.' })
  body: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/review/7d09a171-6726-4dec-b557-0ece420c6bce.jpg',
    description: '이미지 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl: string;
}
