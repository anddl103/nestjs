import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QuestionAnswerFormDTO {
  @ApiProperty({
    example: '<h1>답변 내용</h1><h2>답변 내용</h2><h3>답변 내용</h3>',
    description: '답변 내용',
    required: true,
  })
  @IsNotEmpty({ message: '답변 내용을 작성해주세요.' })
  body: string;
}
