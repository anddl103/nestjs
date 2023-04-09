import { ApiProperty, PickType } from '@nestjs/swagger';
import { QuestionEntity } from '../../common/entities/questions.entity';

export class QuestionDetailDTO extends PickType(QuestionEntity, [
  'id',
  'createdAt',
  'title',
  'body',
  'imageUrl1',
  'imageUrl2',
  'status',
  'isAnswered',
  'type',
  'category',
] as const) {
  @ApiProperty({
    example: {
      fullName: '오사장',
    },
    description: '작성자(점주) 이름',
  })
  owner: object;

  @ApiProperty({
    example: {
      fullName: '김고객',
    },
    description: '작성자(고객) 이름',
  })
  user: object;

  @ApiProperty({
    example: {
      body: '<p>답변 입니다</p>',
      createdAt: '2022-05-23T04:45:54.637Z',
    },
    description: '답변',
  })
  questionAnswer: object;
}
