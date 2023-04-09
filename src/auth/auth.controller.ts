import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { OwnerRole } from '../common/enums/owner-role';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { OwnerLoginDTO } from '../owners/dtos/owner-login.dto';
import { OwnerLoginResDTO } from '../owners/dtos/owner-login.res.dto';
import { OwnerRegisterResponseDTO } from '../owners/dtos/owner-reg.res.dto';
import { OwnerStoreRegisterDTO } from '../owners/dtos/owner-store-reg.dto';
import { OwnerUsernameDTO } from '../owners/dtos/owner-username.dto';
import { OwnerBasicRegisterDTO } from '../owners/dtos/owner-basic-reg.dto';
import { OwnerPasswordChangeDTO } from '../owners/dtos/owner-password-change.dto';
import { OwnerPasswordForgotDTO } from 'src/owners/dtos/owner-password-forgot.dto';
import { ImpCertificationFormDTO } from './dtos/imp-certification-form';
import { EncryptPhoneDTO } from './dtos/encrypt-phone-form';
import { DnggChpher } from 'src/common/utils/dnggCipher';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('check/username')
  @ApiOperation({ summary: '회원 아이디 중복체크' })
  async checkOwnerUsername(@Body() ownerUsernameDTO: OwnerUsernameDTO) {
    await this.authService.checkOwnerUsername(ownerUsernameDTO);

    return new CommonResponseDTO('아이디 중복체크 성공', {}, {});
  }

  @Post('register/manager')
  @ApiOperation({ summary: '운영자 회원가입' })
  @ApiResponse({
    type: OwnerRegisterResponseDTO,
    description: 'success',
    status: 200,
  })
  async registerManager(@Body() ownerBasicRegisterDTO: OwnerBasicRegisterDTO) {
    // TODO 개발 편의를 위해 직접 회원가입 가능하도록 허용, 추후 admin 이 manager 권한을 주는 API가 필요
    const result: OwnerRegisterResponseDTO =
      await this.authService.registerOwnerManager(ownerBasicRegisterDTO);

    return new CommonResponseDTO('운영자 회원가입 성공', result, {});
  }

  @Post('register/store')
  @ApiOperation({ summary: '점주 회원가입' })
  @ApiResponse({
    type: OwnerRegisterResponseDTO,
    description: 'success',
    status: 200,
  })
  async registerStore(@Body() ownerStoreRegisterDTO: OwnerStoreRegisterDTO) {
    const result: OwnerRegisterResponseDTO =
      await this.authService.registerOwnerStore(ownerStoreRegisterDTO);

    return new CommonResponseDTO(
      '점주 회원가입 성공(운영자 승인 대기)',
      result,
      {},
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '회원 로그인' })
  @ApiResponse({
    type: OwnerLoginResDTO,
    description: 'success',
    status: 200,
  })
  async login(@Body() ownerLoginDTO: OwnerLoginDTO, @Req() req) {
    // LocalAuthGuard 는 아이디, 비밀번호 그리고 점주인 경우 가게인증까지 체크
    const user = req.user;
    const result = await this.authService.login(user);
    return new CommonResponseDTO('로그인 성공', result, {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '내 회원정보' })
  async getProfile(@Req() req) {
    // JwtAuthGuard 는 인증된 사용자만 사용
    const user = req.user;
    if (user.phoneNumber) {
      const chpher = new DnggChpher();
      const encryptedPhoneNumber = await chpher.decrypt(user.phoneNumber);
      user.phoneNumber = encryptedPhoneNumber;
    }
    return new CommonResponseDTO('로그인 회원정보', user, {});
  }

  @UseGuards(JwtAuthGuard)
  @Post('change/password')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '비밀번호 변경' })
  async changePassword(
    @Body() ownerPasswordChangeDTO: OwnerPasswordChangeDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    // 비밀번호 변경은 로그인한 유저만 사용 가능
    const username: string = currentOwner.username;
    await this.authService.changePassword(ownerPasswordChangeDTO, username);

    return new CommonResponseDTO('비밀번호 변경', {}, {});
  }

  @UseGuards(JwtAuthGuard)
  @Post('change/phoneNumber')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '휴대폰번호 변경',
    description:
      '운영자의 경우 휴대폰번호(phoneNumber)만 입력<br>점주의 경우 아임포트 핸드폰 인증정보 처리 성공 후 휴대폰번호(phoneNumber), 인증번호(impUid)를 입력',
  })
  async changePhoneNumber(
    @Body() impCertificationFormDTO: ImpCertificationFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    // 휴대폰번호 변경은 로그인한 유저만 사용 가능
    const username: string = currentOwner.username;
    const oldPhoneNumber: string = currentOwner.phoneNumber;
    await this.authService.changePhoneNumber(
      impCertificationFormDTO,
      username,
      oldPhoneNumber,
      roleId,
    );

    return new CommonResponseDTO('휴대폰번호 변경', {}, {});
  }

  @Post('forgot/password')
  @ApiOperation({
    summary: '비밀번호 찾기',
    description:
      '아이디(username)만 입력<br>아이디(username)가 이메일 형식이므로 해당 이메일로 임시 비밀번호 발송<br>발급받은 임시 비밀번호로 로그인 후 비밀번호 변경 필요',
  })
  async forgotPassword(@Body() ownerPasswordForgotDTO: OwnerPasswordForgotDTO) {
    await this.authService.forgotPassword(ownerPasswordForgotDTO);

    return new CommonResponseDTO('비밀번호 찾기', {}, {});
  }

  @Post('forgot/username')
  @ApiOperation({
    summary: '아이디 찾기',
    description:
      '점주 전용<br>아임포트 핸드폰 인증정보 처리 성공 후 휴대폰번호(phoneNumber), 인증번호(impUid)를 입력<br>휴대폰번호에 해당되는 아이디를 리턴',
  })
  async forgotUsername(
    @Body() impCertificationFormDTO: ImpCertificationFormDTO,
  ) {
    const { phoneNumber, impUid } = impCertificationFormDTO;
    const username = await this.authService.forgotUsername(phoneNumber, impUid);

    return new CommonResponseDTO('아이디 찾기', username, {});
  }

  @UseGuards(JwtAuthGuard)
  @Post('encrypt/phone')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '휴대폰번호 암호화(테스트용)',
  })
  async encryptPhone(
    @Body() encryptPhoneDTO: EncryptPhoneDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin)
      throw new UnauthorizedException('관리자만 접근할 수 있습니다.');

    const { phone } = encryptPhoneDTO;
    const encrepytPhone = await this.authService.encryptPhone(phone);

    return new CommonResponseDTO(
      '휴대폰번호 암호화(테스트용)',
      encrepytPhone,
      {},
    );
  }
}
