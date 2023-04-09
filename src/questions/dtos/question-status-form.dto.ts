import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { QuestionStatus } from '../../common/enums/question-status';

export class QuestionStatusFormDTO {
  @ApiProperty({
    enum: [
      QuestionStatus.Ready,
      QuestionStatus.Received,
      QuestionStatus.Processing,
      QuestionStatus.Finished,
    ],
    example: QuestionStatus.Ready,
    description:
      '[ready: 문의중, received: 접수, processing: 처리중, finished: 완료]',
    required: true,
  })
  @IsEnum(QuestionStatus)
  status: QuestionStatus;
}
