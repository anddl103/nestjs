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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { OpenStatus } from '../common/enums/open-status';
import { RelayTo } from '../common/enums/relay-to';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { StoreOwnerDTO } from './dtos/store-owner.dto';
import { OwnerDTO } from '../owners/dtos/owner.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { StoreOwnerSearchDTO } from './dtos/store-owner-search.dto';
import { StoreOwnerDetailDTO } from './dtos/store-owner-detail.dto';
import { StoreOwnerEditDTO } from './dtos/store-owner-edit.dto';
import { StoreOpenHourDetailEditDTO } from './dtos/store-open-hour-detail-edit.dto';
import { StoreOpenHourDetailDTO } from './dtos/store-open-hour-detail.dto';
import { StoreStopHourDTO } from './dtos/store-stop-hour.dto';
import { StoreStopHourEditDTO } from './dtos/store-stop-hour-edit.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('stores')
@Controller('api/v1/stores')
export class StoresController {
  private readonly logger = new Logger(StoresController.name);

  constructor(private readonly storesService: StoresService) {}

  @Post('all')
  @ApiOperation({
    summary: '가게 일괄 생성 ( 테스트용 )',
    description: '관리자 또는 운영자 전용',
  })
  async registerStoreOwnerList(@CurrentUser() currentOwner: OwnerDTO) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    await this.storesService.registerStoreOwners();
    return new CommonResponseDTO('가게 일괄 생성', {}, {});
  }

  @Get()
  @ApiOperation({
    summary: '가게 리스트',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    type: StoreOwnerDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getStoreOwnerList(
    @Query() storeOwnerSearchDTO: StoreOwnerSearchDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    const storeOwnerList: Pagination<any, IPaginationMeta> =
      await this.storesService.findStoreOwners(storeOwnerSearchDTO);

    return new CommonSearchResponseDTO('가게 리스트', storeOwnerList);
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiOperation({
    summary: '가게 상세',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    type: StoreOwnerDetailDTO,
    description: 'success',
    status: 200,
  })
  async getStoreOwnerDetail(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    const storeOwner = await this.storesService.findStoreOwnerByStoreId(id);
    return new CommonResponseDTO('가게 상세', storeOwner, {});
  }

  @Get('detail/me')
  @ApiOperation({
    summary: '가게 상세 ( 점주용 )',
    description:
      '점주 전용 - 가게 상세 API 의 id 패스 파라미터가 겹치기 때문에 detail/me 로 경로 설정',
  })
  @ApiResponse({
    type: StoreOwnerDetailDTO,
    description: 'success',
    status: 200,
  })
  async getStoreOwnerDetailByCurrentUser(
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Store)
      throw new UnauthorizedException('점주만 접근할 수 있습니다.');

    const ownerId = currentOwner.id;
    const storeOwner = await this.storesService.findStoreOwnerByOwnerId(
      ownerId,
    );

    return new CommonResponseDTO('가게 상세 ( 점주용 )', storeOwner, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 상세의 id 를 입력',
  })
  @ApiBody({ type: StoreOwnerEditDTO })
  @ApiOperation({
    summary: '가게 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: StoreOwnerDetailDTO,
    description: 'success',
    status: 200,
  })
  async updateStoreOwnerDetail(
    @Param('id', ParseIntPipe) id,
    @Body() storeOwnerEditDTO: StoreOwnerEditDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    const store = await this.storesService.findOneById(id);
    if (roleId === OwnerRole.Store) {
      if (ownerId !== store.ownerId)
        throw new UnauthorizedException(
          '점주의 경우 본인 가게만 수정할 수 있습니다.',
        );
    }

    // TODO 위경도 값 추가 처리 ( 화면에 항목X, API 항목만 추가 )
    await this.storesService.updateStoreOwnerByIds(
      storeOwnerEditDTO,
      id,
      store.ownerId,
    );

    return new CommonResponseDTO('가게 수정', {}, {});
  }

  @Get(':id/open-hour')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiOperation({
    summary: '가게운영 및 영업시간설정 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: StoreOpenHourDetailDTO,
    description: 'success',
    status: 200,
  })
  async getStoreOpenHourDetail(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId === OwnerRole.Store && ownerStoreId !== id)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 Id : ${id}`,
      );

    const storeOpenHourDetail =
      await this.storesService.findStoreOpenHoursByStoreId(id);

    return new CommonResponseDTO('영업시간설정 상세', storeOpenHourDetail, {});
  }

  @Patch(':id/open-hour')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiOperation({
    summary: '영업시간설정 수정',
    description:
      '관리자 또는 운영자, 점주일 경우 본인 가게<br>평일/주말동일, 평일/주말구분의 경우 월요일 기준 세팅<br>평일/주말구분의 경우 토요일 기준 주말 세팅',
  })
  async updateStoreOpenHourDetail(
    @Param('id', ParseIntPipe) id,
    @Body() storeOpenHourDetailEditDTO: StoreOpenHourDetailEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId === OwnerRole.Store && ownerStoreId !== id)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 Id : ${id}`,
      );

    await this.storesService.updateStoreOpenHourListByStoreId(
      storeOpenHourDetailEditDTO,
      id,
    );

    return new CommonResponseDTO('영업시간설정 수정', {}, {});
  }

  @Get(':id/stop-hour')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiOperation({
    summary: '영업임시중지 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: StoreStopHourDTO,
    description: 'success',
    status: 200,
  })
  async getStoreStopHourDetail(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId === OwnerRole.Store && ownerStoreId !== id)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 Id : ${id}`,
      );

    const storeStopHourDetail: StoreStopHourDTO =
      await this.storesService.findStoreStopHourByStoreId(id);

    return new CommonResponseDTO('영업임시중지 상세', storeStopHourDetail, {});
  }

  @Patch(':id/stop-hour')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiOperation({
    summary: '영업임시중지 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateStoreStopHour(
    @Param('id', ParseIntPipe) id,
    @Body() storeStopHourEditDTO: StoreStopHourEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId === OwnerRole.Store && ownerStoreId !== id)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 Id : ${id}`,
      );

    await this.storesService.updateStoreStopHourByStoreId(
      storeStopHourEditDTO,
      id,
    );

    return new CommonResponseDTO('영업임시중지 수정', {}, {});
  }

  @Patch(':id/open-status/:openStatus')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiParam({
    example: OpenStatus.Open,
    enum: OpenStatus,
    name: 'openStatus',
    required: true,
    description: '영업상황(시작-open|중지-stop|종료-close)',
  })
  @ApiOperation({
    summary: '가게운영 영업상태 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateStoreStatus(
    @Param('id', ParseIntPipe) id,
    @Param('openStatus') openStatus: OpenStatus,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId === OwnerRole.Store && ownerStoreId !== id)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 Id : ${id}`,
      );

    await this.storesService.updateStoreStatusByStoreId(openStatus, id);

    return new CommonResponseDTO('가게운영 영업상태 수정', {}, {});
  }

  @Patch(':id/relay-to/:relayTo')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '가게 리스트에서 가게 id 를 입력',
  })
  @ApiParam({
    example: RelayTo.POS,
    enum: RelayTo,
    name: 'relayTo',
    required: true,
    description: '주문전달 종류(포스-POS|프로그램-FOODNET24)',
  })
  @ApiOperation({
    summary: '가게 주문전달 종류 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateStoreRelayTo(
    @Param('id', ParseIntPipe) id,
    @Param('relayTo') relayTo: RelayTo,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    if (roleId === OwnerRole.Store && ownerStoreId !== id)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 Id : ${id}`,
      );

    await this.storesService.updateStoreRelayToByStoreId(relayTo, id);

    return new CommonResponseDTO('가게 주문전달 종류 수정', {}, {});
  }
}
