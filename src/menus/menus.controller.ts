import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { MenusService } from './menus.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { MenuSearchDTO } from './dtos/menu-search.dto';
import { MenuDTO } from './dtos/menu.dto';
import { MenuRegisterDTO } from './dtos/menu-reg.dto';
import { MenuDetailDTO } from './dtos/menu-detail.dto';
import { MenuEditDTO } from './dtos/menu-edit.dto';
import { MenuListDTO } from './dtos/menu-list.dto';
import { MenuSignatureDTO } from './dtos/menu-signature.dto';
import { MenuPopularDTO } from './dtos/menu-popular.dto';
import { MenuSoldoutDTO } from './dtos/menu-soldout.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('menus')
@Controller('api/v1/menus')
export class MenusController {
  private readonly logger = new Logger(MenusController.name);

  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({
    summary: '메뉴 리스트',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: MenuListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getMenuList(
    @Query() menuSearchDTO: MenuSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    const storeId = menuSearchDTO.storeId;
    //this.logger.log('isEqual == : ' + (ownerStoreId == storeId));
    //this.logger.log('isEqual === : ' + (ownerStoreId === storeId));
    if (roleId === OwnerRole.Store && ownerStoreId != storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    const menuList: Pagination<any, IPaginationMeta> =
      await this.menusService.findMenusBySearch(menuSearchDTO);

    return new CommonSearchResponseDTO('메뉴 리스트', menuList);
  }

  @Post()
  @ApiBody({ type: MenuRegisterDTO })
  @ApiOperation({
    summary: '메뉴 등록',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async registerMenu(
    @Body() menuRegisterDTO: MenuRegisterDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const { storeId } = menuRegisterDTO;
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    await this.menusService.registerMenu(storeId, menuRegisterDTO);

    return new CommonResponseDTO('메뉴 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '메뉴 리스트에서 원하는 메뉴의 id 를 입력',
  })
  @ApiOperation({
    summary: '메뉴 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: MenuDetailDTO,
    description: 'success',
    status: 200,
  })
  async getMenuDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store) {
      await this.menusService.getValidatedMenuByIds(id, ownerStoreId);
    } else {
      await this.menusService.getValidatedMenuById(id);
    }

    const menuDetail: MenuDetailDTO = await this.menusService.findMenuById(id);

    return new CommonResponseDTO('메뉴 상세', menuDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '메뉴 리스트에서 원하는 메뉴의 id 를 입력',
  })
  @ApiBody({ type: MenuEditDTO })
  @ApiOperation({
    summary: '메뉴 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() menuEditDTO: MenuEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    let menu: MenuDTO;
    let storeId;
    if (roleId === OwnerRole.Store) {
      menu = await this.menusService.getValidatedMenuByIds(id, ownerStoreId);
      storeId = menu.storeId;
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    } else {
      menu = await this.menusService.getValidatedMenuById(id);
      storeId = menu.storeId;
    }

    await this.menusService.updateMenuById(id, storeId, menu, menuEditDTO);

    return new CommonResponseDTO('메뉴 수정', {}, {});
  }

  @Patch('update/signature')
  @ApiBody({ type: MenuSignatureDTO })
  @ApiOperation({
    summary: '메뉴 리스트 수정 ( 대표메뉴 )',
    description:
      '관리자 또는 운영자, 점주일 경우 본인 가게<br>최대 5개까지 대표메뉴로 설정 가능하며 menuIds 에 없는 아이디는 대표메뉴에서 제외됩니다.',
  })
  async updateSignatureMenus(
    @Body() menuSignatureDTO: MenuSignatureDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    const { storeId } = menuSignatureDTO;
    if (roleId === OwnerRole.Store) {
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    }

    await this.menusService.updateSignatureMenusById(storeId, menuSignatureDTO);

    return new CommonResponseDTO('메뉴 리스트 수정 ( 대표메뉴 )', {}, {});
  }

  @Patch('update/popular')
  @ApiBody({ type: MenuPopularDTO })
  @ApiOperation({
    summary: '메뉴 리스트 수정 ( 인기메뉴 )',
    description:
      '관리자 또는 운영자, 점주일 경우 본인 가게<br>최대 5개까지 인기메뉴로 설정 가능하며 menuIds 에 없는 아이디는 인기메뉴에서 제외됩니다.',
  })
  async updatePopularMenus(
    @Body() menuPopularDTO: MenuPopularDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    const { storeId } = menuPopularDTO;
    if (roleId === OwnerRole.Store) {
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    }

    await this.menusService.updatePopularMenusById(storeId, menuPopularDTO);

    return new CommonResponseDTO('메뉴 리스트 수정 ( 인기메뉴 )', {}, {});
  }

  @Patch('update/soldout')
  @ApiBody({ type: MenuSoldoutDTO })
  @ApiOperation({
    summary: '메뉴 리스트 수정 ( 품절처리 )',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateSoldoutMenus(
    @Body() menuSoldoutDTO: MenuSoldoutDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    const { storeId } = menuSoldoutDTO;
    if (roleId === OwnerRole.Store) {
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    }

    await this.menusService.updateSoldoutMenusById(storeId, menuSoldoutDTO);

    return new CommonResponseDTO('메뉴 리스트 수정 ( 품절처리 )', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '메뉴 리스트에서 원하는 메뉴의 id 를 입력',
  })
  @ApiOperation({
    summary: '메뉴 삭제',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async deleteMenu(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    let menu: MenuDTO;
    if (roleId === OwnerRole.Store) {
      menu = await this.menusService.getValidatedMenuByIds(id, ownerStoreId);
    } else {
      menu = await this.menusService.getValidatedMenuById(id);
    }

    await this.menusService.deleteMenuById(id, menu.menuGroupId);

    return new CommonResponseDTO('메뉴 삭제', {}, {});
  }
}
