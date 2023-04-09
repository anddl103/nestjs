import {
  Body,
  Controller,
  Delete,
  Get,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CommonResponseDTO } from 'src/common/dtos/common.res.dto';
import { CommonSearchResponseDTO } from 'src/common/dtos/common.search.res.dto';
import { OwnerRole } from 'src/common/enums/owner-role';
import { OwnerDTO } from 'src/owners/dtos/owner.dto';
import { BannerService } from './banner.service';
import { BannerEditDTO } from './dtos/banner-edit.dto';
import { BannerRegisterDTO } from './dtos/banner-res.dto';
import { BannerSearchDTO } from './dtos/banner-search.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('banner')
@Controller('api/v1/banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post()
  @ApiOperation({ summary: '배너 등록' })
  @ApiResponse({
    type: CommonResponseDTO,
    description: 'success',
    status: 200,
  })
  async registerBanner(
    @Body() bannerRegisterDTO: BannerRegisterDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    // 권한 체크
    await this.checkRoleAdminAndManager(currentOwner);
    await this.bannerService.registerBanner(bannerRegisterDTO, currentOwner);
    return new CommonResponseDTO('배너 등록', {}, {});
  }

  @Get()
  @ApiOperation({
    summary: '배너 리스트',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    // type: BannerDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getBannerList(
    @Query() bannerSearchDTO: BannerSearchDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    // 권한 체크
    await this.checkRoleAdminAndManager(currentOwner);

    const bannerList: Pagination<any, IPaginationMeta> =
      await this.bannerService.getBannerList(bannerSearchDTO);

    return new CommonSearchResponseDTO('배너 리스트', bannerList);
  }

  @Get(':id')
  @ApiParam({
    example: 3,
    name: 'id',
    required: true,
    description: '배너 리스트에서 배너의 id 를 입력',
  })
  @ApiOperation({
    summary: '배너 상세',
    description: '관리자 또는 운영자',
  })
  @ApiResponse({
    // type: OwnerStoreDetailDTO,
    description: 'success',
    status: 200,
  })
  async getOwnerStoreDetail(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    // 권한 체크
    await this.checkRoleAdminAndManager(currentOwner);
    const ownerStore = await this.bannerService.getBannerById(id);

    return new CommonResponseDTO('배너 상세', ownerStore, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 3,
    name: 'id',
    required: true,
    description: '배너 리스트에서 배너의 id 를 입력',
  })
  @ApiBody({ type: BannerEditDTO })
  @ApiOperation({
    summary: '배너 수정',
    description: '관리자 또는 운영자 전용',
  })
  async updateOwnerStore(
    @Param('id', ParseIntPipe) id,
    @Body() bannerEditDTO: BannerEditDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    // 권한 체크
    await this.checkRoleAdminAndManager(currentOwner);
    await this.bannerService.updateBannerById(id, bannerEditDTO, currentOwner);
    return new CommonResponseDTO('배너 수정', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '배너 리스트에서 원하는 문의의 id 를 입력',
  })
  @ApiOperation({
    summary: '배너 삭제',
    description: '관리자 및 운영자만 삭제 가능',
  })
  async deleteBanner(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    // 권한 체크
    await this.checkRoleAdminAndManager(currentOwner);

    // 문의 삭제
    await this.bannerService.deleteBannerById(id);

    return new CommonResponseDTO('배너 삭제', {}, {});
  }

  /**
   * 관리자 및 매니저 권한 체크
   * @param currentOwner
   */
  private async checkRoleAdminAndManager(currentOwner: OwnerDTO) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
  }
}
