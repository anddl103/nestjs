import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CommonResponseDTO } from 'src/common/dtos/common.res.dto';
import { CodeEntity } from 'src/common/entities/code.entity';
import { TreeEntity } from 'src/common/entities/tree.entity';
import { OwnerRole } from 'src/common/enums/owner-role';
import { OwnerDTO } from 'src/owners/dtos/owner.dto';
import { CodesService } from './codes.service';
import { CodeRegisterDTO } from './dtos/code-reg.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('codes')
@Controller('api/v1/codes')
export class CodesController {
  constructor(private codesService: CodesService) {}

  @Get(':ref/:id')
  @ApiParam({
    example: 'terget',
    name: 'ref',
    required: true,
    description: '그룹명을 입력',
  })
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '부모 id 를 입력',
  })
  @ApiOperation({ summary: '코드 조회' })
  @ApiResponse({
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getCodeList(@Param('ref') ref, @Param('id', ParseIntPipe) id) {
    const codeList: TreeEntity[] =
      await this.codesService.findCodeListByRefAndParentId(ref, id);

    return new CommonResponseDTO('코드 리스트', codeList, {});
  }

  @Post()
  @ApiOperation({ summary: '코드 등록' })
  async registerCode(
    @CurrentUser() currentOwner: OwnerDTO,
    @Body() codeRegisterDTO: CodeRegisterDTO,
  ) {
    console.log(111);
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin && roleId != OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    await this.codesService.registerCode(codeRegisterDTO);

    return new CommonResponseDTO('코드 등록', {}, {});
  }
}
