import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../common/entities/questions.entity';
import { QuestionAnswerEntity } from '../common/entities/question-answers.entity';
import { QuestionType } from '../common/enums/question-type';
import { QuestionCategory } from '../common/enums/question-category';
import { QuestionStatus } from '../common/enums/question-status';
import { QuestionFormDTO } from './dtos/question-form.dto';
import { QuestionSearchDTO } from './dtos/question-search.dto';
import { QuestionDTO } from './dtos/question.dto';
import { QuestionStatusFormDTO } from './dtos/question-status-form.dto';
import { QuestionAnswerFormDTO } from './dtos/question-answer-form.dto';
import { QuestionAnswerDTO } from './dtos/question-answer.dto';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionsRepository: Repository<QuestionEntity>,
    @InjectRepository(QuestionAnswerEntity)
    private readonly questionAnswersRepository: Repository<QuestionAnswerEntity>,
  ) {}

  async getQuestionList(
    questionSearchDTO: QuestionSearchDTO,
  ): Promise<Pagination<QuestionEntity, IPaginationMeta>> {
    const queryBuilder = this.questionsRepository.createQueryBuilder('q');
    queryBuilder.select([
      'q.id',
      'q.createdAt',
      'q.title',
      'q.imageUrl1',
      'q.imageUrl2',
      'q.status',
      'q.isAnswered',
      'q.category',
      'o.fullName',
      'u.fullName',
      'a.createdAt',
    ]);
    // 점주 연동
    queryBuilder.leftJoin('q.owner', 'o');
    // 일반회원 연동
    queryBuilder.leftJoin('q.user', 'u');
    // 답변 연동
    queryBuilder.leftJoin('q.questionAnswer', 'a');
    const { type, keyword } = questionSearchDTO;
    // 타입(고객, 점주) 설정
    queryBuilder.where('q.type = :type', { type });
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('q.title like :title', {
        title: '%' + keyword + '%',
      });
      queryBuilder.orWhere('q.body like :title', {
        body: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('q.createdAt', 'DESC');

    const questionList = paginate<QuestionEntity>(
      queryBuilder,
      questionSearchDTO.getIPaginationOptions(),
    );
    return questionList;
  }

  async getQuestionListByOwnerId(
    questionSearchDTO: QuestionSearchDTO,
    ownerId: number,
  ): Promise<Pagination<QuestionEntity, IPaginationMeta>> {
    const queryBuilder = this.questionsRepository.createQueryBuilder('q');
    queryBuilder.select([
      'q.id',
      'q.createdAt',
      'q.title',
      'q.imageUrl1',
      'q.imageUrl2',
      'q.status',
      'q.isAnswered',
      'q.category',
      'o.fullName',
      'u.fullName',
      'a.createdAt',
    ]);
    queryBuilder.leftJoin('q.owner', 'o');
    queryBuilder.leftJoin('q.questionAnswer', 'a');
    const { keyword } = questionSearchDTO;
    // type 은 무시
    // 점주 연동
    queryBuilder.where('q.ownerId = :ownerId', { ownerId });
    // 일반회원 연동
    queryBuilder.leftJoin('q.user', 'u');
    // 답변 연동
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('q.title like :title', {
        title: '%' + keyword + '%',
      });
      queryBuilder.orWhere('q.body like :title', {
        body: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('q.createdAt', 'DESC');

    const questionList = paginate<QuestionEntity>(
      queryBuilder,
      questionSearchDTO.getIPaginationOptions(),
    );
    return questionList;
  }

  async registerQuestion(
    ownerId: number,
    questionFormDTO: QuestionFormDTO,
  ): Promise<void> {
    const { title, body, imageUrl1, imageUrl2 } = questionFormDTO;
    // 문의 유형
    let { category } = questionFormDTO;
    if (category === undefined) {
      category = QuestionCategory.Default;
    }
    // 문의 분류 ( 점주 - owner )
    const type = QuestionType.Owner;
    // 문의 상태 설정 ( 문의중 - ready )
    const status = QuestionStatus.Ready;
    // 문의 등록
    await this.questionsRepository.save({
      title,
      body,
      imageUrl1,
      imageUrl2,
      ownerId,
      type,
      category,
      status,
    });
  }

  async getQuestionById(id: number): Promise<any> {
    // 문의 상세
    const questionDetail = await this.questionsRepository
      .createQueryBuilder('q')
      .select([
        'q.id',
        'q.createdAt',
        'q.title',
        'q.body',
        'q.imageUrl1',
        'q.imageUrl2',
        'q.status',
        'q.isAnswered',
        'q.type',
        'q.category',
        'o.fullName',
        'u.fullName',
        'a.body',
        'a.createdAt',
      ])
      .leftJoin('q.owner', 'o')
      .leftJoin('q.user', 'u')
      .leftJoin('q.questionAnswer', 'a')
      .where('q.id = :id', { id })
      .getOne();

    return questionDetail;
  }

  async updateQuestionById(
    id: number,
    questionFormDTO: QuestionFormDTO,
  ): Promise<void> {
    const { title, body, imageUrl1, imageUrl2 } = questionFormDTO;
    // 문의 유형
    let { category } = questionFormDTO;
    if (category === undefined) {
      category = QuestionCategory.Default;
    }
    // 문의 수정
    await this.questionsRepository.update(id, {
      title,
      body,
      imageUrl1,
      imageUrl2,
      category,
    });
  }

  async updateQuestionStatusById(
    id: number,
    questionStatusFormDTO: QuestionStatusFormDTO,
  ): Promise<void> {
    const { status } = questionStatusFormDTO;
    // 문의 상태 수정
    await this.questionsRepository.update(id, {
      status,
    });
  }

  async deleteQuestionById(id: number): Promise<void> {
    // 문의 삭제
    await this.questionsRepository.softDelete(id);
  }

  async registerQuestionAnswer(
    id: number,
    ownerId: number,
    questionAnswerFormDTO: QuestionAnswerFormDTO,
  ): Promise<void> {
    const { body } = questionAnswerFormDTO;
    // 답변 중복 등록 체크
    const questionAnswer: QuestionAnswerDTO =
      await this.questionAnswersRepository.findOne({
        questionId: id,
      });
    if (questionAnswer) {
      throw new NotFoundException(`답변이 이미 등록되어있습니다.`);
    }
    // 답변 등록
    await this.questionAnswersRepository.save({
      questionId: id,
      ownerId,
      body,
    });
    // 문의 상태 설정 ( 완료 - finished )
    const status = QuestionStatus.Finished;
    // 문의 상태 수정
    await this.questionsRepository.update(id, {
      status,
      isAnswered: true,
    });
  }

  async updateQuestionAnswerById(
    id: number,
    ownerId: number,
    questionAnswerFormDTO: QuestionAnswerFormDTO,
  ): Promise<void> {
    const { body } = questionAnswerFormDTO;
    // 답변 수정
    await this.questionAnswersRepository.update(id, {
      ownerId,
      body,
    });
  }

  async deleteQuestionAnswerById(
    id: number,
    questionId: number,
    ownerId: number,
  ): Promise<void> {
    // 삭제자 아이디 업데이트
    await this.questionAnswersRepository.update(id, {
      ownerId,
    });
    // 답변 삭제
    await this.questionAnswersRepository.softDelete(id);
    // 문의 상태 설정 ( 문의중 - ready )
    const status = QuestionStatus.Ready;
    // 문의 상태 수정
    await this.questionsRepository.update(
      { id: questionId },
      {
        status,
        isAnswered: false,
      },
    );
  }

  async getValidatedQuestionById(id: number): Promise<QuestionDTO> {
    const question: QuestionDTO = await this.questionsRepository.findOne({
      id,
    });
    if (!question) {
      throw new NotFoundException(`등록되지 않은 문의입니다.( id: ${id} )`);
    }

    return question;
  }

  async getValidatedQuestionAnswerById(
    questionId: number,
  ): Promise<QuestionAnswerDTO> {
    const questionAnswer: QuestionAnswerDTO =
      await this.questionAnswersRepository.findOne({
        questionId,
      });
    if (!questionAnswer) {
      throw new NotFoundException(
        `등록되지 않은 답변입니다.( questionId: ${questionId} )`,
      );
    }

    return questionAnswer;
  }
}
