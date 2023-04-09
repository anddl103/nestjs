import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { QuestionEntity } from './questions.entity';

@Entity({
  name: 'question_answer',
})
export class QuestionAnswerEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '문의 아이디',
  })
  @Column({ type: 'int', nullable: false })
  questionId: number;

  @ApiProperty({
    example: 1,
    description: '운영자(작성자) 아이디',
  })
  @Column({ type: 'int', nullable: false })
  ownerId: number;

  @ApiProperty({
    example: '<p>답변 내용입니다</p>',
    description: '답변 내용',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  body: string;

  @OneToOne(() => QuestionEntity, (question) => question.questionAnswer)
  @JoinColumn()
  question: QuestionEntity;
}
