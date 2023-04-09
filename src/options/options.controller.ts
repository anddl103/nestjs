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
import { OptionsService } from './options.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { OptionListDTO } from './dtos/option-list.dto';
import { OptionRegisterDTO } from './dtos/option-reg.dto';
import { OptionDetailDTO } from './dtos/option-detail.dto';
import { OptionEditDTO } from './dtos/option-edit.dto';
import { OptionDTO } from './dtos/option.dto';
import { OptionPositionDTO } from './dtos/option-position.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('options')
@Controller('api/v1/options')
export class OptionsController {
  private readonly logger = new Logger(OptionsController.name);

  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  @ApiQuery({
    example: 12,
    name: 'storeId',
    required: true,
    description:
      '가게 리스트에서 원하는 가게의 id 를 입력<br>점주의 경우 auth/me > storeId 를 입력',
  })
  @ApiQuery({
    example: 1,
    name: 'optionGroupId',
    required: true,
    description: '옵션그룹 리스트에서 원하는 옵션그룹의 id 를 입력',
  })
  @ApiOperation({
    summary: '옵션 리스트',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: OptionListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getOptionList(
    @Query('storeId', ParseIntPipe) storeId: number,
    @Query('optionGroupId', ParseIntPipe) optionGroupId: number,
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

    let optionList: OptionListDTO[] =
      await this.optionsService.findOptionsByStoreId(storeId, optionGroupId);

    return new CommonResponseDTO('옵션 리스트', optionList, {});
  }

  @Post()
  @ApiBody({ type: OptionRegisterDTO })
  @ApiOperation({
    summary: '옵션 등록',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async registerOption(
    @Body() optionRegisterDTO: OptionRegisterDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const { storeId } = optionRegisterDTO;
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
      );

    await this.optionsService.registerOption(storeId, optionRegisterDTO);

    return new CommonResponseDTO('옵션 등록', {}, {});
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '옵션 리스트에서 원하는 옵션의 id 를 입력',
  })
  @ApiOperation({
    summary: '옵션 상세',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: OptionDetailDTO,
    description: 'success',
    status: 200,
  })
  async getOptionDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    if (roleId === OwnerRole.Store) {
      await this.optionsService.getValidatedOptionByIds(id, ownerStoreId);
    } else {
      await this.optionsService.getValidatedOptionById(id);
    }

    const optionDetail: OptionDetailDTO =
      await this.optionsService.findOptionById(id);

    return new CommonResponseDTO('옵션 상세', optionDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '옵션 리스트에서 원하는 옵션의 id 를 입력',
  })
  @ApiBody({ type: OptionEditDTO })
  @ApiOperation({
    summary: '옵션 수정',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async updateOption(
    @Param('id', ParseIntPipe) id: number,
    @Body() optionEditDTO: OptionEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    let option: OptionDTO;
    let storeId;
    if (roleId === OwnerRole.Store) {
      option = await this.optionsService.getValidatedOptionByIds(
        id,
        ownerStoreId,
      );
      storeId = option.storeId;
      if (ownerStoreId !== storeId)
        throw new UnauthorizedException(
          `본인의 storeId 를 입력해 주세요. 입력된 storeId : ${storeId}`,
        );
    } else {
      option = await this.optionsService.getValidatedOptionById(id);
    }

    await this.optionsService.updateOptionById(id, optionEditDTO);

    return new CommonResponseDTO('옵션 수정', {}, {});
  }

  @Delete(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '옵션 리스트에서 원하는 옵션의 id 를 입력',
  })
  @ApiOperation({
    summary: '옵션 삭제',
    description: '관리자 또는 운영자, 점주일 경우 본인 가게',
  })
  async deleteOption(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    //this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId + ', ownerStoreId: ' + ownerStoreId);
    let option: OptionDTO;
    if (roleId === OwnerRole.Store) {
      option = await this.optionsService.getValidatedOptionByIds(
        id,
        ownerStoreId,
      );
    } else {
      option = await this.optionsService.getValidatedOptionById(id);
    }

    await this.optionsService.deleteOptionById(id, option.optionGroupId);

    return new CommonResponseDTO('옵션 삭제', {}, {});
  }
}
