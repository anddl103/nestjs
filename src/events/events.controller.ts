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
import { EventsService } from './events.service';
import { EventSearchDTO } from './dtos/event-search.dto';
import { EventListDTO } from './dtos/event-list.dto';
import { EventDetailDTO } from './dtos/event-detail.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { EventEntity } from '../common/entities/events.entity';
import { EventFormDTO } from './dtos/event-form.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('events')
@Controller('api/v1/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: '이벤트 리스트', description: '관리자 또는 운영자' })
  @ApiResponse({
    type: EventListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getEventList(
    @Query() eventSearchDTO: EventSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    const eventList: Pagination<EventEntity, IPaginationMeta> =
      await this.eventsService.getEventList(eventSearchDTO);

    return new CommonSearchResponseDTO('이벤트 리스트', eventList);
  }

  @Post()
  @ApiBody({ type: EventFormDTO })
  @ApiOperation({
    summary: '이벤트 등록',
    description: '관리자 또는 운영자',
  })
  async registerEvent(
    @Body() eventFormDTO: EventFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    await this.eventsService.registerEvent(ownerId, eventFormDTO);

    return new CommonResponseDTO('이벤트 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '이벤트 리스트에서 원하는 이벤트의 id 를 입력',
  })
  @ApiOperation({
    summary: '이벤트 상세',
    description: '관리자 또는 운영자',
  })
  @ApiResponse({
    type: EventDetailDTO,
    description: 'success',
    status: 200,
  })
  async getEventDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 이벤트 아이디 체크
    await this.eventsService.getValidatedEventById(id);
    // 이벤트 상세
    const eventDetail: EventDetailDTO = await this.eventsService.getEventById(
      id,
    );

    return new CommonResponseDTO('이벤트 상세', eventDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '이벤트 리스트에서 원하는 이벤트의 id 를 입력',
  })
  @ApiBody({ type: EventFormDTO })
  @ApiOperation({
    summary: '이벤트 수정',
    description: '관리자 또는 운영자',
  })
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() eventFormDTO: EventFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 이벤트 아이디 체크
    await this.eventsService.getValidatedEventById(id);
    // 이벤트 수정
    await this.eventsService.updateEventById(id, ownerId, eventFormDTO);

    return new CommonResponseDTO('이벤트 수정', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '이벤트 리스트에서 원하는 이벤트의 id 를 입력',
  })
  @ApiOperation({
    summary: '이벤트 삭제',
    description: '관리자 또는 운영자',
  })
  async deleteEvent(
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
    // 이벤트 아이디 체크
    await this.eventsService.getValidatedEventById(id);
    // 이벤트 삭제
    await this.eventsService.deleteEventById(id, ownerId);

    return new CommonResponseDTO('이벤트 삭제', {}, {});
  }
}
