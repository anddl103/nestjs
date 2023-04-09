import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionEntity } from '../common/entities/questions.entity';
import { QuestionAnswerEntity } from '../common/entities/question-answers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, QuestionAnswerEntity])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
