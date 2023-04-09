import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { CategoryListDTO } from './dtos/category-list.dto';
import { CategoryFormDTO } from './dtos/category-form.dto';
import { CategoryDetailDTO } from './dtos/category-detail.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('categories')
@Controller('/api/v1/categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: '카테고리 리스트',
    description: '전부 허용',
  })
  @ApiResponse({
    type: CategoryListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async categoryList() {
    const categories: CategoryListDTO[] =
      await this.categoriesService.getCategories();

    return new CommonResponseDTO('카테고리 리스트', categories, {});
  }

  @Post()
  @ApiBody({ type: CategoryFormDTO })
  @ApiOperation({
    summary: '카테고리 등록',
    description: '관리자 또는 운영자',
  })
  async registerCategory(
    @Body() categoryFormDTO: CategoryFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    await this.categoriesService.registerCategory(categoryFormDTO);

    return new CommonResponseDTO('카테고리 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '카테고리 리스트에서 원하는 카테고리의 id 를 입력',
  })
  @ApiOperation({
    summary: '카테고리 상세',
    description: '전부 허용',
  })
  @ApiResponse({
    type: CategoryDetailDTO,
    description: 'success',
    status: 200,
  })
  async getCategoryDetail(@Param('id', ParseIntPipe) id: number) {
    // 카테고리 아이디 체크
    await this.categoriesService.getValidatedCategoryById(id);
    // 카테고리 상세
    const categoryDetail: CategoryDetailDTO =
      await this.categoriesService.getCategoryById(id);

    return new CommonResponseDTO('카테고리 상세', categoryDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '카테고리 리스트에서 원하는 카테고리의 id 를 입력',
  })
  @ApiBody({ type: CategoryFormDTO })
  @ApiOperation({
    summary: '카테고리 수정',
    description: '관리자 또는 운영자',
  })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryFormDTO: CategoryFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 카테고리 아이디 체크
    const category = await this.categoriesService.getValidatedCategoryById(id);
    // 카테고리 수정
    await this.categoriesService.updateCategoryById(
      id,
      category,
      categoryFormDTO,
    );

    return new CommonResponseDTO('카테고리 수정', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '카테고리 리스트에서 원하는 카테고리의 id 를 입력',
  })
  @ApiOperation({
    summary: '카테고리 삭제',
    description: '관리자 또는 운영자',
  })
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 카테고리 아이디 체크
    await this.categoriesService.getValidatedCategoryById(id);
    // 카테고리 삭제
    await this.categoriesService.deleteCategoryById(id);

    return new CommonResponseDTO('카테고리 삭제', {}, {});
  }
}
