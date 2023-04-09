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
import { OwnersService } from './owners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { OwnerDTO } from './dtos/owner.dto';
import { OwnerResDTO } from './dtos/owner.res.dto';
import { OwnerManagerDTO } from './dtos/owner-manager.dto';
import { OwnerManagerEditDTO } from './dtos/owner-manager-edit.dto';
import { OwnerManagerRegisterDTO } from './dtos/owner-manager-reg.dto';
import { OwnerManagerProfileDTO } from './dtos/owner-manager-profile.dto';
import { OwnerStoreDTO } from './dtos/owner-store.dto';
import { OwnerStoreEditDTO } from './dtos/owner-store-edit.dto';
import { OwnerStoreDetailDTO } from './dtos/owner-store-detail.dto';
import { OwnerStoreSearchDTO } from './dtos/owner-store-search.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('owners')
@Controller('api/v1/owners')
export class OwnersController {
  private readonly logger = new Logger(OwnersController.name);

  constructor(private readonly ownersService: OwnersService) {}

  @Get('managers')
  @ApiOperation({ summary: '운영자 리스트', description: '관리자 전용' })
  @ApiResponse({
    type: OwnerManagerDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getOwnerManagerList(@CurrentUser() currentOwner: OwnerDTO) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
    const ownerManagerList: OwnerManagerDTO[] =
      await this.ownersService.findManagerByRoleId();
    return new CommonResponseDTO('운영자 리스트', ownerManagerList, {});
  }

  @Post('managers')
  @ApiOperation({ summary: '운영자 등록', description: '관리자 전용' })
  async registerManager(
    @Body() ownerManagerRegisterDTO: OwnerManagerRegisterDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
    await this.ownersService.registerManagerByAdmin(ownerManagerRegisterDTO);

    return new CommonResponseDTO('운영자 등록 성공', {}, {});
  }

  @Get('managers/:id')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: '운영자 리스트에서 프로필을 가져올 운영자의 id 를 입력',
  })
  @ApiResponse({
    type: OwnerManagerProfileDTO,
    description: 'success',
    status: 200,
  })
  @ApiOperation({
    summary: '운영자 프로필 정보',
    description: '관리자, 운영자일 경우 본인만',
  })
  async getOwnerManagerProfile(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    if (roleId === OwnerRole.Manager && id != ownerId)
      throw new UnauthorizedException(
        `본인의 Id 를 입력해 주세요. 입력된 Id : ${id}`,
      );
    const ownerManagerProfileDto: OwnerManagerProfileDTO =
      await this.ownersService.getManagerProfileByAdmin(id);

    return new CommonResponseDTO(
      '운영자 프로필 정보',
      ownerManagerProfileDto,
      {},
    );
  }

  @Patch('managers/:id')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: '운영자 리스트에서 프로필을 수정할 운영자의 id 를 입력',
  })
  @ApiBody({ type: OwnerManagerEditDTO })
  @ApiOperation({
    summary: '운영자 프로필 수정',
    description: '관리자, 운영자일 경우 본인만',
  })
  async updateOwnerManagerProfile(
    @Param('id', ParseIntPipe) id,
    @Body() ownerManagerEditDTO: OwnerManagerEditDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerId = currentOwner.id;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    if (roleId === OwnerRole.Manager && id != ownerId)
      throw new UnauthorizedException(
        `본인의 Id 를 입력해 주세요. 입력된 Id : ${id}`,
      );
    await this.ownersService.updateManagerByAdmin(ownerManagerEditDTO, id);
    return new CommonResponseDTO('운영자 프로필 수정', {}, {});
  }

  @Delete('managers/:id')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: '운영자 리스트에서 삭제할 운영자의 id 를 입력',
  })
  @ApiOperation({ summary: '운영자 삭제', description: '관리자 전용' })
  async removeOwnerManager(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
    await this.ownersService.removeManagerByAdmin(id);
    return new CommonResponseDTO('운영자 삭제', {}, {});
  }

  @Get('stores')
  @ApiOperation({
    summary: '점주 리스트',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    type: OwnerStoreDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getOwnerStoreList(
    @Query() ownerStoreSearchDTO: OwnerStoreSearchDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    const ownerStoreList: Pagination<any, IPaginationMeta> =
      await this.ownersService.findOwnerStoresByRoleId(ownerStoreSearchDTO);

    return new CommonSearchResponseDTO('점주 리스트', ownerStoreList);
  }

  @Get('stores/:id')
  @ApiParam({
    example: 3,
    name: 'id',
    required: true,
    description:
      '점주 리스트에서 점주의 id 를 입력<br>본인일 경우 auth/me 의 id 를 입력',
  })
  @ApiOperation({
    summary: '점주 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: OwnerStoreDetailDTO,
    description: 'success',
    status: 200,
  })
  async getOwnerStoreDetail(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    const ownerId = currentOwner.id;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId === OwnerRole.Store && id !== ownerId) {
      throw new UnauthorizedException(
        `본인의 Id 를 입력해 주세요. 입력된 Id : ${id}`,
      );
    }
    let ownerStore;
    if (roleId === OwnerRole.Store) {
      ownerStore = await this.ownersService.findOwnerStoreByIds(
        id,
        ownerStoreId,
      );
    } else {
      ownerStore = await this.ownersService.findOwnerStoreByOwnerId(id);
    }

    return new CommonResponseDTO('점주 상세', ownerStore, {});
  }

  @Patch('stores/:id')
  @ApiParam({
    example: 3,
    name: 'id',
    required: true,
    description: '점주 리스트에서 점주의 id 를 입력',
  })
  @ApiBody({ type: OwnerStoreEditDTO })
  @ApiOperation({
    summary: '점주 수정',
    description:
      '관리자 또는 운영자 전용, 상태: status ( request | confirm | reject ), 회원메모: memo',
  })
  async updateOwnerStore(
    @Param('id', ParseIntPipe) id,
    @Body() ownerStoreEditDTO: OwnerStoreEditDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    await this.ownersService.updateOwnerStoreById(ownerStoreEditDTO, id);
    return new CommonResponseDTO('점주 수정', {}, {});
  }
}
