import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CommonResponseDTO } from 'src/common/dtos/common.res.dto';
import { MaintenanceOs } from 'src/common/enums/maintenance-os';
import { OwnerRole } from 'src/common/enums/owner-role';
import { ImagesService } from 'src/images/images.service';
import { OwnerDTO } from 'src/owners/dtos/owner.dto';
import { MaintenanceDTO } from './dtos/maintenance.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('maintenance')
@Controller('api/v1/maintenance')
export class MaintenanceController {
  private readonly MODE = process.env.DB_NAME;

  constructor(private imagesService: ImagesService) {}

  @Post()
  @ApiOperation({ summary: '유지보수 정보 조회' })
  @ApiResponse({
    type: '',
    description: 'success',
    status: 200,
  })
  async putMaintenance(
    @CurrentUser() currentOwner: OwnerDTO,
    @Body() maintenanceDTO: MaintenanceDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
    // const userRegRes: UserRegisterResponseDTO =
    //   await this.usersService.registerUser(userRegisterDTO);

    const filename = this.getFilename();

    await this.imagesService.uploadS3ObjectJson(filename, maintenanceDTO);

    const maintenance = await this.imagesService.getS3Object(filename);

    return new CommonResponseDTO('회원가입 성공', maintenance, {});
  }

  @Get()
  @ApiOperation({ summary: '일반회원 리스트' })
  @ApiResponse({
    type: '',
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getMaintenance(@CurrentUser() currentOwner: OwnerDTO) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');

    const filename = this.getFilename();
    console.log('filename : ' + filename);
    const maintenance = await this.imagesService.getS3Object(filename);
    return new CommonResponseDTO('일반회원 리스트', maintenance, {});
  }

  private getFilename() {
    let filename = 'devmaintenance';

    if (this.MODE && this.MODE === 'prod_store') {
      filename = 'maintenance';
    }

    return filename;
  }

  /**
   * 안드로이드, ios 버전
   */
  @Post(':os')
  @ApiOperation({ summary: '유지보수 정보 조회' })
  @ApiResponse({
    type: '',
    description: 'success',
    status: 200,
  })
  async putMaintenanceOs(
    @Param('os', new ParseEnumPipe(MaintenanceOs)) os: MaintenanceOs,
    @CurrentUser() currentOwner: OwnerDTO,
    @Body() maintenanceDTO: MaintenanceDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
    // const userRegRes: UserRegisterResponseDTO =
    //   await this.usersService.registerUser(userRegisterDTO);

    const filename = this.concatOsFilename(os);

    await this.imagesService.uploadS3ObjectJson(filename, maintenanceDTO);

    const maintenance = await this.imagesService.getS3Object(filename);

    return new CommonResponseDTO('회원가입 성공', maintenance, {});
  }

  @Get(':os')
  @ApiOperation({ summary: '일반회원 리스트' })
  @ApiResponse({
    type: '',
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getMaintenanceOs(
    @Param('os', new ParseEnumPipe(MaintenanceOs)) os: MaintenanceOs,
    @CurrentUser() currentOwner: OwnerDTO,
  ): Promise<CommonResponseDTO> {
    const roleId = currentOwner.roleId;
    if (roleId != OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');

    // const filename = this.concatOsFilename(os);
    const filename = 'a';
    console.log('filename : ' + filename);
    const maintenance = await this.imagesService.getS3Object(filename);
    return new CommonResponseDTO('일반회원 리스트', maintenance, {});
  }

  private concatOsFilename(os: MaintenanceOs) {
    const filename = this.getFilename();
    return `${os}/${filename}`;
  }
}
