import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { OwnersService } from '../owners/owners.service';
import { OwnerRole } from '../common/enums/owner-role';
import { OwnerStatus } from '../common/enums/owner-status';
import { MemberType } from '../common/enums/member-type';
import { DnggChpher } from '../common/utils/dnggCipher';
import { OwnerLoginDTO } from '../owners/dtos/owner-login.dto';
import { OwnerLoginResDTO } from '../owners/dtos/owner-login.res.dto';
import { OwnerStoreRegisterDTO } from '../owners/dtos/owner-store-reg.dto';
import { OwnerUsernameDTO } from '../owners/dtos/owner-username.dto';
import { OwnerRegisterResponseDTO } from '../owners/dtos/owner-reg.res.dto';
import { OwnerBasicRegisterDTO } from '../owners/dtos/owner-basic-reg.dto';
import { OwnerPasswordChangeDTO } from '../owners/dtos/owner-password-change.dto';
import { OwnerPasswordForgotDTO } from '../owners/dtos/owner-password-forgot.dto';
import { ForgotPasswordFormDTO } from '../mail/dtos/forgot-password-form.dto';
import { IamportCertificationEntity } from '../common/entities/iamport-certifications.entity';
import { ImpCertificationResDTO } from './dtos/imp-certification.res';
import { ImpCertificationFormDTO } from './dtos/imp-certification-form';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly PASSWORD_LENGTH = 10;
  private readonly ALPHA_NUMERIC =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly ownersService: OwnersService,
    @InjectRepository(IamportCertificationEntity)
    private readonly iamportCertificationsRepository: Repository<IamportCertificationEntity>,
  ) {}

  async checkOwnerUsername(ownerUsernameDTO: OwnerUsernameDTO): Promise<void> {
    const username = ownerUsernameDTO.username;
    const owner = await this.ownersService.findOneByUsername(username);
    //this.logger.log('owner: ' + owner);
    if (owner)
      throw new UnauthorizedException('해당 아이디는 사용할 수 없습니다.');
  }

  async registerOwnerManager(
    ownerBasicRegisterDTO: OwnerBasicRegisterDTO,
  ): Promise<any> {
    // 운영자 roleId
    const roleId = OwnerRole.Manager;
    const result: OwnerRegisterResponseDTO =
      await this.ownersService.registerOwnerManager(
        ownerBasicRegisterDTO,
        roleId,
      );
    return result;
  }

  async registerOwnerStore(
    ownerStoreRegisterDTO: OwnerStoreRegisterDTO,
  ): Promise<any> {
    const { phoneNumber, impUid } = ownerStoreRegisterDTO;
    // 휴대폰 본인인증 저장
    const encryptedPhoneNumber = await this.registerCertification(
      phoneNumber,
      impUid,
    );
    // 점주 roleId
    const roleId = OwnerRole.Store;
    // 점주회원 등록
    const result: OwnerRegisterResponseDTO =
      await this.ownersService.registerOwnerStore(
        ownerStoreRegisterDTO,
        encryptedPhoneNumber,
        roleId,
      );
    return result;
  }

  async validateUser(
    username: OwnerLoginDTO['username'],
    pwd: OwnerLoginDTO['password'],
  ): Promise<any> {
    const user = await this.ownersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: '아이디 혹은 비밀번호 오류입니다.',
        error: 'NotFound',
      });
    }

    // 초기 패스워드일 경우 패스워드 암호화해서 저장
    if (pwd === user.password) {
      await this.ownersService.initPassword(username, pwd);
    } else {
      if (!(await bcrypt.compare(pwd, user.password)))
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: '아이디 혹은 비밀번호 오류입니다.',
          error: 'Unauthorized',
        });
    }

    // 점주일 경우
    if (user.roleId === OwnerRole.Store) {
      //isConfirmed 가 false 면 403 오류 처리
      if (!user.isConfirmed) {
        // 상태(대기|반려) 체크
        let resultMessage = '가게인증 대기 중입니다.';
        if (user.status === OwnerStatus.Reject)
          resultMessage = '가게인증이 반려 되었습니다.';
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: resultMessage,
          error: 'Forbidden',
        });
      }
    }

    const { password, ...result } = user;
    //this.logger.log(JSON.stringify(result));
    return result;
  }

  async login(user: any) {
    try {
      let userStoreId = 0;
      if (user.stores[0]) {
        userStoreId = user.stores[0].id;
      }
      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
          phoneNumber: user.phoneNumber,
          roleId: user.roleId,
          storeId: userStoreId,
        },
        { secret: this.configService.get('SECRET_KEY') },
      );
      const ownerLoginRes = new OwnerLoginResDTO();
      ownerLoginRes.accessToken = accessToken;

      return ownerLoginRes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changePassword(
    ownerPasswordChangeDTO: OwnerPasswordChangeDTO,
    username: string,
  ): Promise<void> {
    const { currentPassword, newPassword } = ownerPasswordChangeDTO;
    // owner 정보 체크
    const user = await this.ownersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'owner 정보가 존재하지 않습니다.',
        error: 'NotFound',
      });
    }
    // 현재 비밀번호와 새 비밀번호가 동일한지 체크
    if (currentPassword === newPassword) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '현재 비밀번호와 새 비밀번호가 동일합니다.',
        error: 'BadRequest',
      });
    }
    // 현재 비밀번호 체크
    if (!(await bcrypt.compare(currentPassword, user.password)))
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: '비밀번호 오류입니다.',
        error: 'Unauthorized',
      });
    // 새 비밀번호로 변경
    await this.ownersService.changePassword(username, newPassword);
  }

  async changePhoneNumber(
    impCertificationFormDTO: ImpCertificationFormDTO,
    username: string,
    oldPhoneNumber: string,
    roleId: number,
  ): Promise<void> {
    const { phoneNumber, impUid } = impCertificationFormDTO;
    // 휴대폰번호 체크
    await this.validatePhone(phoneNumber);
    // 변경할 휴대폰번호 암호화
    const chpher = new DnggChpher();
    const encryptedPhoneNumber = await chpher.encrypt(phoneNumber);
    // 점주인 경우
    if (roleId === OwnerRole.Store) {
      // 휴대폰 본인인증 검증 및 업데이트
      await this.updateCertification(
        oldPhoneNumber,
        encryptedPhoneNumber,
        impUid,
      );
    }
    // 휴대폰번호 변경
    await this.ownersService.changePhoneNumber(username, encryptedPhoneNumber);
  }

  async forgotPassword(
    ownerPasswordForgotDTO: OwnerPasswordForgotDTO,
  ): Promise<void> {
    const { username } = ownerPasswordForgotDTO;
    const owner = await this.ownersService.findOneByUsername(username);
    // 임시 비밀번호 생성
    const tempPassword = await this.randomString(
      this.PASSWORD_LENGTH,
      this.ALPHA_NUMERIC,
    );
    // 임시 비밀번호로 변경
    await this.ownersService.changePassword(username, tempPassword);
    // 이메일 전송
    const forgotPasswordFormDTO = new ForgotPasswordFormDTO();
    forgotPasswordFormDTO.toAddress = owner.username;
    forgotPasswordFormDTO.subject = '임시 비밀번호가 발급되었습니다.';
    forgotPasswordFormDTO.username = owner.username;
    forgotPasswordFormDTO.fullName = owner.fullName;
    forgotPasswordFormDTO.tempPassword = tempPassword;
    await this.mailService.tempPasswordMail(forgotPasswordFormDTO);
  }

  async randomString(length: number, chars: string): Promise<string> {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async forgotUsername(phone: string, impUid: string): Promise<string> {
    // 아임포트 인증정보 검증 및 점주정보 가져오기
    const owner = await this.verifyCertification(phone, impUid);
    // username 리턴
    return owner.username;
  }

  async registerCertification(
    phoneNumber: string,
    impUid: string,
  ): Promise<string> {
    // 휴대폰번호 체크
    await this.validatePhone(phoneNumber);

    // 아임포트 인증번호 체크
    if (impUid === '' || impUid === null || impUid === undefined) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아임포트 인증번호(impUid)를 입력해 주십시오.',
        error: 'BadRequest',
      });
    }
    // 휴대폰번호 암호화
    const chpher = new DnggChpher();
    const encryptedPhoneNumber = await chpher.encrypt(phoneNumber);
    // 기존에 본인인증 정보가 있는지 체크
    const impCertification = await this.iamportCertificationsRepository.findOne(
      {
        memberType: MemberType.Owner,
        phoneNumber: encryptedPhoneNumber,
      },
    );
    if (impCertification) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '본인인증 정보가 이미 존재합니다.',
        error: 'Forbidden',
      });
    }
    // 아임포트 인증정보 조회
    const result = await this.callCertification(impUid);
    // 아임포트 인증정보 저장
    await this.iamportCertificationsRepository.save({
      memberType: MemberType.Owner,
      phoneNumber: encryptedPhoneNumber,
      impUid,
      uniqueKey: result.unique_key,
      uniqueInSite: result.unique_in_site,
      name: result.name,
      gender: result.gender,
      birthday: result.birthday,
    });

    return encryptedPhoneNumber;
  }

  async updateCertification(
    oldPhoneNumber: string,
    encryptedPhoneNumber: string,
    impUid: string,
  ): Promise<void> {
    // 아임포트 인증번호 체크
    if (impUid === '' || impUid === null || impUid === undefined) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아임포트 인증번호(impUid)를 입력해 주십시오.',
        error: 'BadRequest',
      });
    }
    // 기존 본인인증 정보가 있는지 체크
    const impCertification = await this.iamportCertificationsRepository.findOne(
      {
        memberType: MemberType.Owner,
        phoneNumber: oldPhoneNumber,
      },
    );
    if (!impCertification) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '기존 본인인증 정보가 존재하지 않습니다.',
        error: 'Forbidden',
      });
    }
    // 아임포트 인증정보 조회
    const result = await this.callCertification(impUid);
    // 기존 본인인증 정보와 비교
    if (impCertification.uniqueKey !== result.unique_key) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '잘못된 CI(unique_key) 정보입니다.',
        error: 'Forbidden',
      });
    }
    // 아임포트 인증정보 > 인증번호, 휴대폰번호 업데이트
    await this.iamportCertificationsRepository.update(
      { uniqueKey: result.unique_key },
      {
        phoneNumber: encryptedPhoneNumber,
        impUid,
      },
    );
  }

  async verifyCertification(phoneNumber: string, impUid: string): Promise<any> {
    // 휴대폰번호 체크
    await this.validatePhone(phoneNumber);
    // 아임포트 인증번호 체크
    if (impUid === '' || impUid === null || impUid === undefined) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아임포트 인증번호(impUid)를 입력해 주십시오.',
        error: 'BadRequest',
      });
    }
    // 휴대폰번호 암호화
    const chpher = new DnggChpher();
    const encryptedPhoneNumber = await chpher.encrypt(phoneNumber);
    // 휴대폰번호의 점주 정보 체크
    const owner = await this.ownersService.findOwnerByPhoneNumber(
      encryptedPhoneNumber,
    );
    if (!owner) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'owner 정보가 존재하지 않습니다.',
        error: 'NotFound',
      });
    }
    // 기존 본인인증 정보가 있는지 체크
    const impCertification = await this.iamportCertificationsRepository.findOne(
      {
        memberType: MemberType.Owner,
        phoneNumber: encryptedPhoneNumber,
      },
    );
    if (!impCertification) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: '기존 본인인증 정보가 존재하지 않습니다.',
        error: 'NotFound',
      });
    }
    // 아임포트 인증정보 조회
    const result = await this.callCertification(impUid);
    // 기존 본인인증 정보와 비교
    if (impCertification.uniqueKey !== result.unique_key) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: '잘못된 CI(unique_key) 정보입니다.',
        error: 'Forbidden',
      });
    }

    return owner;
  }

  async callCertification(imp_uid: string): Promise<ImpCertificationResDTO> {
    try {
      const getTokenUrl = '/users/getToken';
      const getTokenForm = {
        imp_key: this.configService.get('IMP_KEY'),
        imp_secret: this.configService.get('IMP_SECRET'),
      };
      // 인증 토큰 발급 받기
      const getToken = await firstValueFrom(
        this.httpService.post(getTokenUrl, getTokenForm),
      );
      const { access_token } = getToken.data.response;
      // header > Authorization 토큰 설정
      const axiosInstance = this.httpService.axiosRef;
      axiosInstance.defaults.headers['Authorization'] = access_token;
      // imp_uid로 인증 정보 조회
      const getCertificationsUrl = '/certifications/' + imp_uid;
      const getCertifications = await firstValueFrom(
        this.httpService.get(getCertificationsUrl),
      );
      // 조회한 인증 정보
      const certificationsInfo = getCertifications.data.response;
      // 인증 정보 DTO 매핑
      const impCertificationResDTO = new ImpCertificationResDTO();
      impCertificationResDTO.unique_key = certificationsInfo.unique_key;
      impCertificationResDTO.unique_in_site = certificationsInfo.unique_in_site;
      impCertificationResDTO.name = certificationsInfo.name;
      impCertificationResDTO.gender = certificationsInfo.gender;
      impCertificationResDTO.birthday = certificationsInfo.birthday;

      return impCertificationResDTO;
    } catch (e) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: '아임포트 본인인증 정보가 존재하지 않습니다.',
        error: 'NotFound',
      });
    }
  }

  async encryptPhone(phone: string): Promise<string> {
    // 핸드폰번호 암호화
    const chpher = new DnggChpher();
    const phoneNumber = await chpher.encrypt(phone);
    this.logger.log('encrypt phoneNumber: ' + phoneNumber);
    return phoneNumber;
  }

  private async validatePhone(phoneNumber: string): Promise<void> {
    const regexPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (regexPhone.test(phoneNumber) !== true) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '휴대폰번호(phoneNumber) 형식이 잘못되었습니다.',
        error: 'BadRequest',
      });
    }
  }
}
