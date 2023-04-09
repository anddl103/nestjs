import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { QuestionsService } from './questions.service';
import { QuestionSearchDTO } from './dtos/question-search.dto';
import { QuestionListDTO } from './dtos/question-list.dto';
import { QuestionDetailDTO } from './dtos/question-detail.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { QuestionEntity } from '../common/entities/questions.entity';
import { QuestionFormDTO } from './dtos/question-form.dto';
import { QuestionStatusFormDTO } from './dtos/question-status-form.dto';
import { QuestionAnswerFormDTO } from './dtos/question-answer-form.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('questions')
@Controller('api/v1/questions')
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);

  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({
    summary: '문의 리스트',
    description:
      '관리자 또는 운영자, 점주의 경우 본인 문의 리스트<br>고객의 경우 type을 user, 점주의 경우 type을 owner 로 설정',
  })
  @ApiResponse({
    type: QuestionListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getQuestionList(
    @Query() questionSearchDTO: QuestionSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    let questionList: Pagination<QuestionEntity, IPaginationMeta>;
    if (roleId === OwnerRole.Admin || roleId === OwnerRole.Manager) {
      // 관리자 혹은 운영자의 경우 전체 문의 리스트
      questionList = await this.questionsService.getQuestionList(
        questionSearchDTO,
      );
    } else if (roleId === OwnerRole.Store) {
      // 점주 roleId 일 경우 본인 문의 리스트
      questionList = await this.questionsService.getQuestionListByOwnerId(
        questionSearchDTO,
        ownerId,
      );
    }

    return new CommonSearchResponseDTO('문의 리스트', questionList);
  }

  @Post()
  @ApiBody({ type: QuestionFormDTO })
  @ApiOperation({
    summary: '문의 등록',
    description:
      '점주만 가능<br>문의 유형 category - [default: 기본, usage: 이용관련, member: 회원관련, store: 가게관련, payment: 결제관련, etc: 기타]',
  })
  async registerQuestion(
    @Body() questionFormDTO: QuestionFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Store) {
      throw new UnauthorizedException('점주만 접근할 수 있습니다.');
    }

    await this.questionsService.registerQuestion(ownerId, questionFormDTO);

    return new CommonResponseDTO('문의 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiOperation({
    summary: '문의 상세',
    description: '관리자 또는 운영자, 점주 본인',
  })
  @ApiResponse({
    type: QuestionDetailDTO,
    description: 'success',
    status: 200,
  })
  async getQuestionDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    // 문의 아이디 체크
    const question = await this.questionsService.getValidatedQuestionById(id);
    // 점주 roleId 일 경우 작성자 아이디 체크
    if (roleId === OwnerRole.Store && question.ownerId !== ownerId) {
      throw new UnauthorizedException(
        `본인의 Id 를 입력해 주세요. 입력된 Id : ${id}`,
      );
    }
    // 문의 상세
    const questionDetail: QuestionDetailDTO =
      await this.questionsService.getQuestionById(id);

    return new CommonResponseDTO('문의 상세', questionDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiBody({ type: QuestionFormDTO })
  @ApiOperation({
    summary: '문의 수정',
    description:
      '작성자(점주)만 수정 가능<br>문의 유형 category - [default: 기본, usage: 이용관련, member: 회원관련, store: 가게관련, payment: 결제관련, etc: 기타]',
  })
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() questionFormDTO: QuestionFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    // 점주 roleId 체크
    if (roleId !== OwnerRole.Store) {
      throw new UnauthorizedException(`점주만 접근 가능합니다.`);
    }
    // 문의 아이디 체크
    const question = await this.questionsService.getValidatedQuestionById(id);
    // 작성자 아이디 체크
    const ownerId = currentOwner.id;
    if (question.ownerId !== ownerId) {
      throw new UnauthorizedException(
        `본인의 Id 를 입력해 주세요. 입력된 Id : ${id}`,
      );
    }
    // 문의 수정
    await this.questionsService.updateQuestionById(id, questionFormDTO);

    return new CommonResponseDTO('문의 수정', {}, {});
  }

  @Patch(':id/status')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiBody({ type: QuestionStatusFormDTO })
  @ApiOperation({
    summary: '문의 상태 수정',
    description:
      '관리자 또는 운영자<br>문의 상태 status - [ready: 문의중, received: 접수, processing: 처리중, finished: 완료]',
  })
  async updateQuestionStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() questionStatusFormDTO: QuestionStatusFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 문의 아이디 체크
    await this.questionsService.getValidatedQuestionById(id);
    // 문의 상태 수정
    await this.questionsService.updateQuestionStatusById(
      id,
      questionStatusFormDTO,
    );

    return new CommonResponseDTO('문의 상태 수정', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiOperation({
    summary: '문의 삭제',
    description: '작성자(점주)만 삭제 가능',
  })
  async deleteQuestion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    // 점주 roleId 체크
    if (roleId !== OwnerRole.Store) {
      throw new UnauthorizedException(`점주만 접근 가능합니다.`);
    }
    // 문의 아이디 체크
    const question = await this.questionsService.getValidatedQuestionById(id);
    // 작성자 아이디 체크
    const ownerId = currentOwner.id;
    if (question.ownerId !== ownerId) {
      throw new UnauthorizedException(
        `본인의 Id 를 입력해 주세요. 입력된 Id : ${id}`,
      );
    }
    // 문의 삭제
    await this.questionsService.deleteQuestionById(id);

    return new CommonResponseDTO('문의 삭제', {}, {});
  }

  @Post(':id/answer')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiBody({ type: QuestionAnswerFormDTO })
  @ApiOperation({
    summary: '답변 등록',
    description: '관리자 또는 운영자',
  })
  async registerQuestionAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Body() questionAnswerFormDTO: QuestionAnswerFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 문의 아이디 체크
    await this.questionsService.getValidatedQuestionById(id);
    // 답변 등록
    await this.questionsService.registerQuestionAnswer(
      id,
      ownerId,
      questionAnswerFormDTO,
    );

    return new CommonResponseDTO('답변 등록', {}, {});
  }

  @Patch(':id/answer')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiBody({ type: QuestionAnswerFormDTO })
  @ApiOperation({
    summary: '답변 수정',
    description: '관리자 또는 운영자',
  })
  async updateQuestionAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Body() questionAnswerFormDTO: QuestionAnswerFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 답변 questionId 체크 및 가져오기
    const questionAnswer =
      await this.questionsService.getValidatedQuestionAnswerById(id);
    // 답변 수정
    await this.questionsService.updateQuestionAnswerById(
      questionAnswer.id,
      ownerId,
      questionAnswerFormDTO,
    );

    return new CommonResponseDTO('답변 수정', {}, {});
  }

  @Delete(':id/answer')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '문의 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiOperation({
    summary: '답변 삭제',
    description: '관리자 또는 운영자',
  })
  async deleteQuestionAnswer(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 답변 questionId 체크 및 가져오기
    const questionAnswer =
      await this.questionsService.getValidatedQuestionAnswerById(id);
    // 문의 삭제
    await this.questionsService.deleteQuestionAnswerById(
      questionAnswer.id,
      questionAnswer.questionId,
      ownerId,
    );

    return new CommonResponseDTO('문의 삭제', {}, {});
  }
}
