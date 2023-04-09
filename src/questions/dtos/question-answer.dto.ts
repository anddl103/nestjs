import { PartialType } from '@nestjs/swagger';
import { QuestionAnswerEntity } from '../../common/entities/question-answers.entity';

export class QuestionAnswerDTO extends PartialType(QuestionAnswerEntity) {}
