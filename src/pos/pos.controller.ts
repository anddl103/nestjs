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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { PosService } from './pos.service';
import { PosBannerFormDTO } from './dtos/pos-banner-form.dto';
import { PosBannerDetailDTO } from './dtos/pos-banner-detail.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('pos')
@Controller('api/v1/pos')
export class PosController {
  private readonly logger = new Logger(PosController.name);

  constructor(private readonly posService: PosService) {}

  @Post('banner')
  @ApiBody({ type: PosBannerFormDTO })
  @ApiOperation({
    summary: 'POS 배너 등록',
    description: '관리자 또는 운영자',
  })
  async registerPosBanner(
    @Body() posBannerFormDTO: PosBannerFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    await this.posService.registerPosBanner(ownerId, posBannerFormDTO);

    return new CommonResponseDTO('POS 배너 등록', {}, {});
  }

  @Get('banner')
  @ApiOperation({
    summary: 'POS 배너 상세',
    description: '관리자 또는 운영자',
  })
  @ApiResponse({
    type: PosBannerDetailDTO,
    description: 'success',
    status: 200,
  })
  async getPosBannerDetail(@CurrentUser() currentOwner: OwnerResDTO) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // POS 배너 상세
    const posbannerDetail: PosBannerDetailDTO =
      await this.posService.getPosBanner();

    return new CommonResponseDTO('POS 배너 상세', posbannerDetail, {});
  }

  @Patch('banner')
  @ApiBody({ type: PosBannerFormDTO })
  @ApiOperation({
    summary: 'POS 배너 수정',
    description: '관리자 또는 운영자',
  })
  async updatePosBanner(
    @Body() posBannerFormDTO: PosBannerFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // POS 배너 수정
    await this.posService.updatePosBanner(ownerId, posBannerFormDTO);

    return new CommonResponseDTO('POS 배너 수정', {}, {});
  }
}
