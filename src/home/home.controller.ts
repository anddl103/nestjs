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
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { CityAndProvince } from '../common/enums/city-and-province';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { RecommendCategoryListDTO } from './dtos/recommend-category-list.dto';
import { RecommendCategoryFormDTO } from './dtos/recommend-category-form.dto';
import { RecommendCategoryDetailDTO } from './dtos/recommend-category-detail.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('home')
@Controller('api/v1/home')
export class HomeController {
  private readonly logger = new Logger(HomeController.name);

  constructor(private readonly homeService: HomeService) {}

  @Get('recommend-categories')
  @ApiOperation({
    summary: '오늘의추천 리스트',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    type: RecommendCategoryListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getRecommendCategoryList(
    @CurrentUser()
    currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    const recommendCategories: RecommendCategoryListDTO[] =
      await this.homeService.findRecommendCategories();

    return new CommonResponseDTO('오늘의추천 리스트', recommendCategories, {});
  }

  @Post('recommend-categories')
  @ApiBody({ type: RecommendCategoryFormDTO })
  @ApiOperation({
    summary: '오늘의추천 등록',
    description: '관리자 또는 운영자 전용',
  })
  async registerRecommendCategory(
    @Body() recommendCategoryFormDTO: RecommendCategoryFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    await this.homeService.registerRecommendCategory(recommendCategoryFormDTO);

    return new CommonResponseDTO('오늘의추천 등록', {}, {});
  }

  @Get('recommend-categories/:id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '오늘의추천 리스트에서 원하는 오늘의추천 id 를 입력',
  })
  @ApiOperation({
    summary: '오늘의추천 상세',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    type: RecommendCategoryDetailDTO,
    description: 'success',
    status: 200,
  })
  async getRecommendCategoryDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    const recommendCategoryDetail =
      await this.homeService.findRecommendCategoryById(id);

    return new CommonResponseDTO(
      '오늘의추천 상세',
      recommendCategoryDetail,
      {},
    );
  }

  @Patch('recommend-categories/:id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '오늘의추천 리스트에서 원하는 오늘의추천 id 를 입력',
  })
  @ApiBody({ type: RecommendCategoryFormDTO })
  @ApiOperation({
    summary: '오늘의추천 수정',
    description: '관리자 또는 운영자 전용',
  })
  async updateRecommendCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() recommendCategoryFormDTO: RecommendCategoryFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    await this.homeService.updateRecommendCategoryById(
      id,
      recommendCategoryFormDTO,
    );

    return new CommonResponseDTO('오늘의추천 수정', {}, {});
  }

  @Delete('recommend-categories/:id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '오늘의추천 리스트에서 원하는 오늘의추천 id 를 입력',
  })
  @ApiOperation({
    summary: '오늘의추천 삭제',
    description: '관리자 또는 운영자 전용',
  })
  async deleteRecommendCategory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    await this.homeService.deleteRecommendCategoryById(id);

    return new CommonResponseDTO('오늘의추천 삭제', {}, {});
  }

  @Get('target-areas')
  @ApiOperation({
    summary: '오늘의추천 노출지역 리스트',
    description: '관리자 또는 운영자 전용',
  })
  @ApiResponse({
    type: String,
    description: 'success',
    status: 200,
  })
  async getTargetAreas(@CurrentUser() currentOwner: OwnerResDTO) {
    const roleId = currentOwner.roleId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    return new CommonResponseDTO(
      '오늘의추천 노출지역 리스트',
      Object.values(CityAndProvince),
      {},
    );
  }
}
