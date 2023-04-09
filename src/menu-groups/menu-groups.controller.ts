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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MenuGroupsService } from './menu-groups.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { MenuGroupDTO } from './dtos/menu-group.dto';
import { MenuGroupEditDTO } from './dtos/menu-group-edit.dto';
import { MenuGroupRegisterDTO } from './dtos/menu-group-reg.dto';
import { MenuGroupPositionDTO } from './dtos/menu-group-position.dto';
import { MenuGroupListDTO } from './dtos/menu-group-list.dto';
import { MenuGroupDetailDTO } from './dtos/menu-group-detail.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('menu-groups')
@Controller('api/v1/menu-groups')
export class MenuGroupsController {
  private readonly logger = new Logger(MenuGroupsController.name);

  constructor(private readonly menuGroupsService: MenuGroupsService) {}

  @Get()
  @ApiQuery({
    example: 12,
    name: 'storeId',
    required: true,
    description:
      '가게 리스트에서 원하는 가게의 id 를 입력<br>점주의 경우 auth/me > storeId 를 입력',
  })
  @ApiOperation({
    summary: '메뉴그룹 리스트',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: MenuGroupListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getMenuGroupList(
    @Query('storeId', ParseIntPipe) storeId: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    const menuGroupList: MenuGroupListDTO[] =
      await this.menuGroupsService.findMenuGroupsByStoreId(storeId);

    return new CommonResponseDTO('메뉴그룹 리스트', menuGroupList, {});
  }

  @Post()
  @ApiBody({ type: MenuGroupRegisterDTO })
  @ApiOperation({
    summary: '메뉴그룹 등록',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async registerMenuGroup(
    @Body() menuGroupRegisterDTO: MenuGroupRegisterDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const { storeId, name, type } = menuGroupRegisterDTO;
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    await this.menuGroupsService.registerMenuGroup(storeId, name, type);

    return new CommonResponseDTO('메뉴그룹 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '메뉴그룹 리스트에서 원하는 메뉴그룹의 id 를 입력',
  })
  @ApiOperation({
    summary: '메뉴그룹 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: MenuGroupDetailDTO,
    description: 'success',
    status: 200,
  })
  async getMenuGroupDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store) {
      await this.menuGroupsService.getValidatedMenuGroupByIds(id, ownerStoreId);
    } else {
      await this.menuGroupsService.getValidatedMenuGroupById(id);
    }

    const menuGroupDetail: MenuGroupDetailDTO =
      await this.menuGroupsService.findMenuGroupById(id);

    return new CommonResponseDTO('메뉴그룹 상세', menuGroupDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '메뉴그룹 리스트에서 원하는 메뉴그룹의 id 를 입력',
  })
  @ApiBody({ type: MenuGroupEditDTO })
  @ApiOperation({
    summary: '메뉴그룹 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateMenuGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() menuGroupEditDTO: MenuGroupEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    let menuGroup: MenuGroupDTO;
    let storeId;
    if (roleId === OwnerRole.Store) {
      menuGroup = await this.menuGroupsService.getValidatedMenuGroupByIds(
        id,
        ownerStoreId,
      );
      storeId = menuGroup.storeId;
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    } else {
      menuGroup = await this.menuGroupsService.getValidatedMenuGroupById(id);
      storeId = menuGroup.storeId;
    }

    await this.menuGroupsService.updateMenuGroupById(
      id,
      storeId,
      menuGroup,
      menuGroupEditDTO,
    );

    return new CommonResponseDTO('메뉴그룹 수정', {}, {});
  }

  @Patch('update/position')
  @ApiBody({ type: MenuGroupPositionDTO })
  @ApiOperation({
    summary: '메뉴그룹 리스트 수정 ( 노출순서 )',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updatePositionMenuGroups(
    @Body() menuGroupPositionDTO: MenuGroupPositionDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    const { storeId } = menuGroupPositionDTO;
    if (roleId === OwnerRole.Store) {
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    }

    await this.menuGroupsService.updatePositionMenuGroupsById(
      storeId,
      menuGroupPositionDTO,
    );

    return new CommonResponseDTO('메뉴그룹 리스트 수정 ( 노출순서 )', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '메뉴그룹 리스트에서 원하는 메뉴그룹의 id 를 입력',
  })
  @ApiOperation({
    summary: '메뉴그룹 삭제',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async deleteMenuGroup(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store) {
      await this.menuGroupsService.getValidatedMenuGroupByIds(id, ownerStoreId);
    } else {
      await this.menuGroupsService.getValidatedMenuGroupById(id);
    }

    await this.menuGroupsService.deleteMenuGroupById(id);

    return new CommonResponseDTO('메뉴그룹 삭제', {}, {});
  }
}
