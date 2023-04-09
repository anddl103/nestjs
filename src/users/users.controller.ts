import {
  Body,
  Controller,
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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { UserAddressSearchDTO } from './dtos/user-address-search.dto';
import { UserRegisterDTO } from './dtos/user-reg.dto';
import { UserRegisterResponseDTO } from './dtos/user-reg.res.dto';
import { UserEditDTO } from './dtos/user-edit.dto';
import { OwnerDTO } from '../owners/dtos/owner.dto';
import { UserAddressDetailDTO } from './dtos/user-address-detail.dto';
import { UserAddressDTO } from './dtos/user-address.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('users')
@Controller('api/v1/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '일반회원 회원가입 ( 테스트용 )' })
  @ApiResponse({
    type: UserRegisterResponseDTO,
    description: 'success',
    status: 200,
  })
  async signUp(
    @CurrentUser() currentOwner: OwnerDTO,
    @Body() userRegisterDTO: UserRegisterDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin && roleId != OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    const userRegRes: UserRegisterResponseDTO =
      await this.usersService.registerUser(userRegisterDTO);

    return new CommonResponseDTO('회원가입 성공', userRegRes, {});
  }

  @Get()
  @ApiOperation({ summary: '일반회원 리스트' })
  @ApiResponse({
    type: UserAddressDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getUserList(
    @Query() userAddressSearchDTO: UserAddressSearchDTO,
    @CurrentUser() currentOwner: OwnerDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin && roleId != OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    const userList: Pagination<any, IPaginationMeta> =
      await this.usersService.findUserList(userAddressSearchDTO);

    return new CommonSearchResponseDTO('일반회원 리스트', userList);
  }

  @Get(':id')
  @ApiParam({
    example: 21,
    name: 'id',
    required: true,
    description: '일반회원 리스트에서 원하는 회원의 id 를 입력',
  })
  @ApiOperation({ summary: '일반회원 상세' })
  @ApiResponse({
    type: UserAddressDetailDTO,
    description: 'success',
    status: 200,
  })
  async getUser(
    @CurrentUser() currentOwner: OwnerDTO,
    @Param('id', ParseIntPipe) userId,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin && roleId != OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    const userDetail = await this.usersService.findUserDetailById(userId);
    return new CommonResponseDTO('일반회원 상세', userDetail, {});
  }

  @Patch(':id')
  @ApiParam({
    example: 21,
    name: 'id',
    required: true,
    description: '일반회원 리스트에서 원하는 회원의 id 를 입력',
  })
  @ApiBody({ type: UserEditDTO })
  @ApiOperation({
    summary: '일반회원 수정',
    description:
      '관리자 또는 운영자 전용, 레벨: level ( 1 | 2 | 3 ), 회원등급: rank ( rookie | local | neighbor | regular ), 회원메모: memo',
  })
  async updateOwnerStore(
    @CurrentUser() currentOwner: OwnerDTO,
    @Param('id', ParseIntPipe) id,
    @Body() userEditDTO: UserEditDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin && roleId != OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    await this.usersService.updateUserById(userEditDTO, id);
    return new CommonResponseDTO('일반회원 수정', {}, {});
  }
}
