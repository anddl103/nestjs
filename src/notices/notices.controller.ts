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
import { NoticesService } from './notices.service';
import { NoticeSearchDTO } from './dtos/notice-search.dto';
import { NoticeListDTO } from './dtos/notice-list.dto';
import { NoticeDetailDTO } from './dtos/notice-detail.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { NoticeEntity } from '../common/entities/notices.entity';
import { NoticeFormDTO } from './dtos/notice-form.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('notices')
@Controller('api/v1/notices')
export class NoticesController {
  private readonly logger = new Logger(NoticesController.name);

  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  @ApiOperation({
    summary: '공지사항 리스트',
    description:
      '전부 허용<br>고객의 경우 type을 user, 점주의 경우 type을 owner 로 설정',
  })
  @ApiResponse({
    type: NoticeListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getNoticeList(@Query() noticeSearchDTO: NoticeSearchDTO) {
    const noticeList: Pagination<NoticeEntity, IPaginationMeta> =
      await this.noticesService.getNoticeList(noticeSearchDTO);

    return new CommonSearchResponseDTO('공지사항 리스트', noticeList);
  }

  @Post()
  @ApiBody({ type: NoticeFormDTO })
  @ApiOperation({
    summary: '공지사항 등록',
    description: '관리자 또는 운영자',
  })
  async registerNotice(
    @Body() noticeFormDTO: NoticeFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    await this.noticesService.registerNotice(ownerId, noticeFormDTO);

    return new CommonResponseDTO('공지사항 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '공지사항 리스트에서 원하는 공지사항의 id 를 입력',
  })
  @ApiOperation({
    summary: '공지사항 상세',
    description: '전부 허용',
  })
  @ApiResponse({
    type: NoticeDetailDTO,
    description: 'success',
    status: 200,
  })
  async getNoticeDetail(@Param('id', ParseIntPipe) id: number) {
    // 공지사항 아이디 체크
    await this.noticesService.getValidatedNoticeById(id);
    // 공지사항 상세
    const noticeDetail: NoticeDetailDTO =
      await this.noticesService.getNoticeById(id);

    return new CommonResponseDTO('공지사항 상세', noticeDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '공지사항 리스트에서 원하는 공지사항의 id 를 입력',
  })
  @ApiBody({ type: NoticeFormDTO })
  @ApiOperation({
    summary: '공지사항 수정',
    description: '관리자 또는 운영자',
  })
  async updateNotice(
    @Param('id', ParseIntPipe) id: number,
    @Body() noticeFormDTO: NoticeFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 공지사항 아이디 체크
    await this.noticesService.getValidatedNoticeById(id);
    // 공지사항 수정
    await this.noticesService.updateNoticeById(id, ownerId, noticeFormDTO);

    return new CommonResponseDTO('공지사항 수정', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '공지사항 리스트에서 원하는 공지사항의 id 를 입력',
  })
  @ApiOperation({
    summary: '공지사항 삭제',
    description: '관리자 또는 운영자',
  })
  async deleteNotice(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 공지사항 아이디 체크
    await this.noticesService.getValidatedNoticeById(id);
    // 공지사항 삭제
    await this.noticesService.deleteNoticeById(id, ownerId);

    return new CommonResponseDTO('공지사항 삭제', {}, {});
  }
}
