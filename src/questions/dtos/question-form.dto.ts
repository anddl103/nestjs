import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QuestionCategory } from 'src/common/enums/question-category';

export class QuestionFormDTO {
  @ApiProperty({
    enum: [
      QuestionCategory.Default,
      QuestionCategory.Usage,
      QuestionCategory.Member,
      QuestionCategory.Store,
      QuestionCategory.Payment,
      QuestionCategory.ETC,
    ],
    example: QuestionCategory.Default,
    description:
      '[default: 기본, usage: 이용관련, member: 회원관련, store: 가게관련, payment: 결제관련, etc: 기타]',
    required: false,
  })
  @IsOptional()
  @IsEnum(QuestionCategory)
  category: QuestionCategory;

  @ApiProperty({
    example: '동네가게 서비스 오픈 문의 제목',
    description: '문의 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '문의 제목을 작성해주세요.' })
  title: string;

  @ApiProperty({
    example: '<h1>문의 내용</h1><h2>문의 내용</h2><h3>문의 내용</h3>',
    description: '문의 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '문의 내용을 작성해주세요.' })
  body: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일 이미지1 URL',
    required: false,
  })
  @IsOptional()
  imageUrl1: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일 이미지2 URL',
    required: false,
  })
  @IsOptional()
  imageUrl2: string;
}
