import {
  BadRequestException,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionGroupsService } from './option-groups.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { SortCreated } from '../common/enums/sort-created';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { OptionGroupDTO } from './dtos/option-group.dto';
import { OptionGroupRegisterDTO } from './dtos/option-group-reg.dto';
import { OptionGroupEditDTO } from './dtos/option-group-edit.dto';
import { OptionGroupPositionDTO } from './dtos/option-group-position.dto';
import { OptionGroupDetailDTO } from './dtos/option-group-detail.dto';
import { OptionGroupListDTO } from './dtos/option-group-list.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('option-groups')
@Controller('api/v1/option-groups')
export class OptionGroupsController {
  private readonly logger = new Logger(OptionGroupsController.name);

  constructor(private readonly optionGroupsService: OptionGroupsService) {}

  @Get()
  @ApiQuery({
    example: 12,
    name: 'storeId',
    required: true,
    description:
      '가게 리스트에서 원하는 가게의 id 를 입력<br>점주의 경우 auth/me > storeId 를 입력',
  })
  @ApiQuery({
    example: true,
    name: 'isRequired',
    required: false,
    description:
      'isRequired 가 true 이면 필수 옵션그룹, false 이면 선택 옵션그룹<br>isRequired 가 없을 경우 전체 옵션그룹',
  })
  @ApiQuery({
    example: 'DESC',
    name: 'sort',
    required: false,
    description:
      'DESC 이면 생성일 기준 내림차순(최신 등록순) - default<br>ASC 이면 생성일 기준 오름차순(오랜된 등록순)',
  })
  @ApiOperation({
    summary: '옵션그룹 리스트',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: OptionGroupListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getOptionGroupList(
    @Query('storeId', ParseIntPipe) storeId: number,
    @Query('isRequired') isRequired,
    @Query('sort') sort,
    @CurrentUser()
    currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    if (sort === undefined) {
      sort = SortCreated.DESC;
    } else {
      if (sort !== SortCreated.ASC && sort !== SortCreated.DESC)
        throw new BadRequestException(
          `sort 는 DESC 혹은 ASC를 입력해 주세요. 입력된 sort : ${sort}`,
        );
    }

    let optionGroupList: OptionGroupListDTO[];
    //this.logger.log('isRequired:' + isRequired);
    if (isRequired === undefined) {
      optionGroupList =
        await this.optionGroupsService.findOptionGroupsByStoreId(storeId, sort);
    } else {
      isRequired = JSON.parse(isRequired);
      optionGroupList =
        await this.optionGroupsService.findOptionGroupsIsRequired(
          storeId,
          isRequired,
          sort,
        );
    }

    return new CommonResponseDTO('옵션그룹 리스트', optionGroupList, {});
  }

  @Post()
  @ApiBody({ type: OptionGroupRegisterDTO })
  @ApiOperation({
    summary: '옵션그룹 등록',
    description:
      '관리자 또는 운영자, 점주일 경우 본인 가게<br>옵션그룹 등록후 옵션그룹 아이디 값을 리턴',
  })
  @ApiResponse({
    type: Number,
    description: 'success',
    status: 200,
  })
  async registerOptionGroup(
    @Body() optionGroupRegisterDTO: OptionGroupRegisterDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const { storeId } = optionGroupRegisterDTO;
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    const optionGroupId: number =
      await this.optionGroupsService.registerOptionGroup(
        storeId,
        optionGroupRegisterDTO,
      );

    return new CommonResponseDTO('옵션그룹 등록', optionGroupId, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '옵션그룹 리스트에서 원하는 옵션그룹의 id 를 입력',
  })
  @ApiOperation({
    summary: '옵션그룹 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: OptionGroupDetailDTO,
    description: 'success',
    status: 200,
  })
  async getOptionGroupDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store) {
      await this.optionGroupsService.getValidatedOptionGroupByIds(
        id,
        ownerStoreId,
      );
    } else {
      await this.optionGroupsService.getValidatedOptionGroupById(id);
    }

    const optionGroupDetail: OptionGroupDetailDTO =
      await this.optionGroupsService.findOptionGroupById(id);

    return new CommonResponseDTO('옵션그룹 상세', optionGroupDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '옵션그룹 리스트에서 원하는 옵션그룹의 id 를 입력',
  })
  @ApiBody({ type: OptionGroupEditDTO })
  @ApiOperation({
    summary: '옵션그룹 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateOptionGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() optionGroupEditDTO: OptionGroupEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    let optionGroup: OptionGroupDTO;
    let storeId;
    if (roleId === OwnerRole.Store) {
      optionGroup = await this.optionGroupsService.getValidatedOptionGroupByIds(
        id,
        ownerStoreId,
      );
      storeId = optionGroup.storeId;
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    } else {
      optionGroup = await this.optionGroupsService.getValidatedOptionGroupById(
        id,
      );
      storeId = optionGroup.storeId;
    }

    await this.optionGroupsService.updateOptionGroupById(
      id,
      storeId,
      optionGroup,
      optionGroupEditDTO,
    );

    return new CommonResponseDTO('옵션그룹 수정', {}, {});
  }

  @Patch('update/position')
  @ApiBody({ type: OptionGroupPositionDTO })
  @ApiOperation({
    summary: '옵션그룹 리스트 수정 ( 노출순서 )',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updatePositionOptionGroups(
    @Body() optionGroupPositionDTO: OptionGroupPositionDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    const { storeId } = optionGroupPositionDTO;
    if (roleId === OwnerRole.Store) {
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    }

    await this.optionGroupsService.updatePositionOptionGroupsById(
      storeId,
      optionGroupPositionDTO,
    );

    return new CommonResponseDTO('옵션그룹 리스트 수정 ( 노출순서 )', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '옵션그룹 리스트에서 원하는 옵션그룹의 id 를 입력',
  })
  @ApiOperation({
    summary: '옵션그룹 삭제',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async deleteOptionGroup(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store) {
      await this.optionGroupsService.getValidatedOptionGroupByIds(
        id,
        ownerStoreId,
      );
    } else {
      await this.optionGroupsService.getValidatedOptionGroupById(id);
    }

    await this.optionGroupsService.deleteOptionGroupById(id);

    return new CommonResponseDTO('옵션그룹 삭제', {}, {});
  }
}
