import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { NoticeType } from '../../common/enums/notice-type';

export class NoticeFormDTO {
  @ApiProperty({
    example: '동네가게 서비스 오픈 공지사항 제목',
    description: '공지사항 제목',
    required: true,
  })
  @IsNotEmpty({ message: '공지사항 제목을 작성해주세요.' })
  title: string;

  @ApiProperty({
    example:
      '<h1>공지사항 내용</h1><h2>공지사항 내용</h2><h3>공지사항 내용</h3>',
    description: '공지사항 내용',
    required: true,
  })
  @IsNotEmpty({ message: '공지사항 내용을 작성해주세요.' })
  body: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일 이미지 URL',
    required: false,
  })
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    enum: [NoticeType.User, NoticeType.Owner],
    example: NoticeType.User,
    description: '공지사항 분류(고객: user, 점주: owner)',
    required: true,
  })
  @IsEnum(NoticeType)
  type: NoticeType;
}
