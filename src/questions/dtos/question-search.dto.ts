import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QuestionType } from '../../common/enums/question-type';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';

export class QuestionSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '',
    description: '문의 검색어 입력',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({
    enum: [QuestionType.User, QuestionType.Owner],
    example: QuestionType.Owner,
    description: '문의 분류(고객: user, 점주: owner)',
    required: true,
  })
  @IsEnum(QuestionType)
  type: QuestionType;
}
