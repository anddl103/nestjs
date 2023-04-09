import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { OwnerEntity } from './owners.entity';
import { UserEntity } from './users.entity';
import { QuestionAnswerEntity } from './question-answers.entity';

@Entity({
  name: 'question',
})
export class QuestionEntity extends CommonEntity {
  @ApiProperty({
    example: 'user',
    description: '문의 분류(고객-user|점주-owner)',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  type: string;

  @ApiProperty({
    example: 'default',
    description:
      '문의 유형(기본-default|이용관련-usage|회원관련-member|가게관련-store|결제관련-payment|기타-etc)',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  category: string;

  @ApiProperty({
    example: 1,
    description: '고객(작성자) 아이디',
  })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({
    example: 1,
    description: '점주(작성자) 아이디',
  })
  @Column({ type: 'int', nullable: true })
  ownerId: number;

  @ApiProperty({
    example: '제목입니다....',
    description: '제목',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({
    example: '내용입니다....',
    description: '내용',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  body: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일 이미지1 URL',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  imageUrl1: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '첨부파일 이미지2 URL',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  imageUrl2: string;

  @ApiProperty({
    example: 'ready',
    description:
      '상태(문의중-ready|접수-received|처리중-processing|완료-finished)',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  status: string;

  @ApiProperty({
    example: false,
    description: '답변 여부',
  })
  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  isAnswered: boolean;

  @ManyToOne(() => OwnerEntity, (owner) => owner.questions)
  owner: OwnerEntity;

  @ManyToOne(() => UserEntity, (user) => user.questions)
  user: UserEntity;

  @OneToOne(
    () => QuestionAnswerEntity,
    (questionAnswer) => questionAnswer.question,
  )
  questionAnswer: QuestionAnswerEntity;
}
