import { PartialType } from '@nestjs/swagger';
import { QuestionEntity } from '../../common/entities/questions.entity';

export class QuestionDTO extends PartialType(QuestionEntity) {}
