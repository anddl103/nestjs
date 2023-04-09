import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { StoresService } from '../stores/stores.service';
import { OwnerEntity } from '../common/entities/owners.entity';
import { OwnerImageEntity } from '../common/entities/owner-images.entity';
import { ImageFileEntity } from '../common/entities/image-files.entity';
import { DnggChpher } from '../common/utils/dnggCipher';
import { OwnerRole } from '../common/enums/owner-role';
import { OwnerStatus } from '../common/enums/owner-status';
import { OwnerStoreSearchDTO } from './dtos/owner-store-search.dto';
import { OwnerRegisterResponseDTO } from './dtos/owner-reg.res.dto';
import { OwnerBasicRegisterDTO } from './dtos/owner-basic-reg.dto';
import { OwnerManagerRegisterDTO } from './dtos/owner-manager-reg.dto';
import { OwnerStoreRegisterDTO } from './dtos/owner-store-reg.dto';
import { OwnerDTO } from './dtos/owner.dto';
import { OwnerManagerDTO } from './dtos/owner-manager.dto';
import { OwnerManagerEditDTO } from './dtos/owner-manager-edit.dto';
import { OwnerManagerProfileDTO } from './dtos/owner-manager-profile.dto';
import { OwnerStoreEditDTO } from './dtos/owner-store-edit.dto';

@Injectable()
export class OwnersService {
  private readonly logger = new Logger(OwnersService.name);

  constructor(
    private readonly storesService: StoresService,
    @InjectRepository(OwnerEntity)
    private readonly ownersRepository: Repository<OwnerEntity>,
    @InjectRepository(OwnerImageEntity)
    private readonly ownerImagesRepository: Repository<OwnerImageEntity>,
    @InjectRepository(ImageFileEntity)
    private readonly imageFilesRepository: Repository<ImageFileEntity>,
  ) {}

  async registerOwnerManager(
    ownerBasicRegisterDTO: OwnerBasicRegisterDTO,
    roleId: number,
  ): Promise<OwnerRegisterResponseDTO> {
    const { username, password } = ownerBasicRegisterDTO;
    const isOwnerExist = await this.ownersRepository.findOne({ username });
    if (isOwnerExist) {
      throw new UnauthorizedException('해당 이메일은 이미 존재합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await this.ownersRepository.save({
      username,
      password: hashedPassword,
      roleId,
    });

    const ownerRes = new OwnerRegisterResponseDTO();
    ownerRes.id = owner.id;
    ownerRes.username = owner.username;
    ownerRes.roleId = owner.roleId;

    return ownerRes;
  }

  async registerOwnerStore(
    ownerStoreRegisterDTO: OwnerStoreRegisterDTO,
    encryptedPhoneNumber: string,
    roleId: number,
  ): Promise<OwnerRegisterResponseDTO> {
    const { username, password, isBenefitNoti, imageFileIds } =
      ownerStoreRegisterDTO;

    // 동네가게 혜택 알림 동의 여부 - 값이 없을 경우(undefined, null, '', 0)는 false
    let isBenefitNotification: boolean = false;
    if (isBenefitNoti) {
      isBenefitNotification = isBenefitNoti;
    }
    // 점주 아이디 체크
    const usernameInfo = await this.ownersRepository.findOne({ username });
    if (usernameInfo) {
      throw new UnauthorizedException('해당 아이디(이메일)은 이미 존재합니다.');
    }
    const phoneNumberInfo = await this.ownersRepository.findOne({
      phoneNumber: encryptedPhoneNumber,
    });
    if (phoneNumberInfo) {
      throw new UnauthorizedException('해당 핸드폰 번호는 이미 존재합니다.');
    }

    for (let i = 0; i < imageFileIds.length; i++) {
      const imageFileId = imageFileIds[i];
      const isImageExist = await this.imageFilesRepository.findOne({
        id: imageFileId,
      });
      if (!isImageExist) {
        throw new UnauthorizedException(
          `해당 아이디의 이미지는 존재하지 않습니다, imageFileId: ${imageFileId}`,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await this.ownersRepository.save({
      username,
      password: hashedPassword,
      roleId,
      phoneNumber: encryptedPhoneNumber,
      isBenefitNoti: isBenefitNotification,
    });

    // 점주 인증사진 등록 4개(사업자 등록증, 가게 외부 사진, 가게 내부 사진, 통장 사본)
    const ownerId = owner.id;
    for (let i = 0; i < imageFileIds.length; i++) {
      const imageFileId = imageFileIds[i];
      await this.ownerImagesRepository.save({
        ownerId,
        imageFileId,
      });
    }

    // 점주 가게 생성
    this.storesService.registerStoreByOwnerId(ownerId);

    const ownerRes = new OwnerRegisterResponseDTO();
    ownerRes.id = ownerId;
    ownerRes.username = owner.username;
    ownerRes.roleId = owner.roleId;

    return ownerRes;
  }

  async initPassword(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await getConnection()
        .createQueryBuilder()
        .update(OwnerEntity)
        .set({ password: hashedPassword })
        .where('owner.username = :ousername', {
          ousername: username,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('초기 비밀번호 암호화에 실패했습니다.');
    }
    this.logger.log('초기 비밀번호 암호화');
  }

  async findOneById(id: number): Promise<OwnerDTO> {
    const owner: OwnerDTO = await this.ownersRepository.findOne({ id });
    if (!owner) {
      throw new NotFoundException('해당하는 회원 정보가 없습니다!');
    }

    return owner;
  }

  async findOneByUsername(username: string): Promise<any> {
    const owner = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .select([
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.password',
        'owner.phoneNumber',
        'owner.roleId',
        'owner.isConfirmed',
        'store.id',
      ])
      .leftJoin('owner.stores', 'store')
      .where('owner.username = :ousername', {
        ousername: username,
      })
      .getOne();

    return owner;
  }

  async findOwnerByPhoneNumber(encryptedPhoneNumber: string): Promise<any> {
    const owner = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .select([
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.isConfirmed',
      ])
      .where('owner.phoneNumber = :ophoneNumber', {
        ophoneNumber: encryptedPhoneNumber,
      })
      .andWhere('owner.roleId = :oroleId', {
        oroleId: OwnerRole.Store,
      })
      .getOne();

    if (!owner) {
      throw new NotFoundException('해당하는 회원 정보가 없습니다!');
    }

    return owner;
  }

  async findManagerByRoleId(): Promise<OwnerManagerDTO[]> {
    const managers: OwnerManagerDTO[] = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .select([
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.roleId',
        'owner.department',
        'owner.createdAt',
      ])
      .where('owner.roleId != :orid', {
        orid: OwnerRole.Store,
      })
      .orderBy('owner.createdAt', 'DESC')
      .getMany();

    return managers;
  }

  async getManagerProfileByAdmin(
    ownerId: number,
  ): Promise<OwnerManagerProfileDTO> {
    const manager: OwnerManagerProfileDTO = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .select([
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.roleId',
        'owner.department',
        'owner.phoneNumber',
        'owner.createdAt',
      ])
      .where('owner.id = :oid', {
        oid: ownerId,
      })
      .getOne();

    if (!manager) {
      throw new NotFoundException('해당하는 운영자가 없습니다!');
    }

    if (
      manager.phoneNumber !== '' &&
      manager.phoneNumber !== null &&
      manager.phoneNumber !== undefined
    ) {
      // 운영자 핸드폰번호 복호화
      const chpher = new DnggChpher();
      manager.phoneNumber = await chpher.decrypt(manager.phoneNumber);
    }

    return manager;
  }

  async registerManagerByAdmin(
    ownerManagerRegisterDTO: OwnerManagerRegisterDTO,
  ): Promise<void> {
    const { username, password, fullName, roleId, department, phoneNumber } =
      ownerManagerRegisterDTO;
    if (roleId === OwnerRole.Store)
      throw new UnauthorizedException(
        '운영자는 점주 권한으로 등록 할 수 없습니다.',
      );
    const isOwnerExist = await this.ownersRepository.findOne({ username });
    if (isOwnerExist) {
      throw new UnauthorizedException('해당 이메일은 이미 존재합니다.');
    }
    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    // 휴대폰 번호 체크(휴대폰 번호가 없는 경우 그대로 입력)
    let encryptedPhoneNumber = phoneNumber;
    if (
      phoneNumber !== '' &&
      phoneNumber !== null &&
      phoneNumber !== undefined
    ) {
      const regexPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
      if (regexPhone.test(phoneNumber) !== true) {
        throw new BadRequestException('휴대폰 번호 형식이 잘못되었습니다.');
      }
      // 휴대폰 번호 암호화
      const chpher = new DnggChpher();
      encryptedPhoneNumber = await chpher.encrypt(phoneNumber);
    }
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(OwnerEntity)
        .values({
          username,
          password: hashedPassword,
          fullName,
          roleId,
          department,
          phoneNumber: encryptedPhoneNumber,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('registerManager');
    }
  }

  async updateManagerByAdmin(
    ownerManagerEditDTO: OwnerManagerEditDTO,
    ownerId: number,
  ): Promise<void> {
    const owner: OwnerDTO = await this.findOneById(ownerId);
    if (!owner) throw new NotFoundException('등록되지 않은 사용자입니다.');
    if (owner.roleId === OwnerRole.Store)
      throw new UnauthorizedException('점주는 수정할 수 없습니다.');

    const { fullName, roleId, department, phoneNumber } = ownerManagerEditDTO;
    if (roleId === OwnerRole.Store)
      throw new UnauthorizedException(
        '운영자는 점주 권한으로 설정 할 수 없습니다.',
      );
    if (owner.roleId === OwnerRole.Admin && roleId !== OwnerRole.Admin)
      throw new UnauthorizedException(
        '수퍼관리자의 등급은 수정할 수 없습니다.',
      );
    // 휴대폰 번호 체크(휴대폰 번호가 없는 경우 그대로 입력)
    let encryptedPhoneNumber = phoneNumber;
    if (
      phoneNumber !== '' &&
      phoneNumber !== null &&
      phoneNumber !== undefined
    ) {
      const regexPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
      if (regexPhone.test(phoneNumber) !== true) {
        throw new BadRequestException('휴대폰 번호 형식이 잘못되었습니다.');
      }
      // 휴대폰 번호 암호화
      const chpher = new DnggChpher();
      encryptedPhoneNumber = await chpher.encrypt(phoneNumber);
    }
    try {
      await getConnection()
        .createQueryBuilder()
        .update(OwnerEntity)
        .set({
          fullName,
          roleId,
          department,
          phoneNumber: encryptedPhoneNumber,
        })
        .where('owner.id = :oid', {
          oid: ownerId,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('updateManagerById');
    }
  }

  async removeManagerByAdmin(ownerId: number): Promise<void> {
    const owner: OwnerDTO = await this.findOneById(ownerId);
    if (!owner) throw new NotFoundException('등록되지 않은 사용자입니다.');
    if (owner.roleId === OwnerRole.Admin)
      throw new UnauthorizedException('수퍼관리자는 삭제할 수 없습니다.');
    if (owner.roleId === OwnerRole.Store)
      throw new UnauthorizedException('점주는 삭제할 수 없습니다.');

    try {
      await getConnection()
        .createQueryBuilder()
        .softDelete()
        .from(OwnerEntity)
        .where('owner.id = :oid', {
          oid: ownerId,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('removeManagerById');
    }
  }

  async findOwnerStoresByRoleId(
    ownerStoreSearchDTO: OwnerStoreSearchDTO,
  ): Promise<Pagination<any, IPaginationMeta>> {
    //this.logger.log('start findStoreByRoleId');
    const queryBuilder = this.ownersRepository.createQueryBuilder('owner');
    queryBuilder.select([
      'owner.id',
      'owner.username',
      'owner.fullName',
      'owner.status',
      'owner.createdAt',
      'store.id',
      'store.category',
      'store.name',
      'store.address1',
      'store.address2',
    ]);
    queryBuilder.leftJoin('owner.stores', 'store');
    queryBuilder.where('owner.roleId = :orid', {
      orid: OwnerRole.Store,
    });
    const { keyword } = ownerStoreSearchDTO;
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('owner.username like :username', {
        username: '%' + keyword + '%',
      });
      queryBuilder.orWhere('owner.fullName like :fullName', {
        fullName: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('owner.createdAt', 'DESC');
    // 점주 리스트
    const ownerStoreList = paginate<any>(
      queryBuilder,
      ownerStoreSearchDTO.getIPaginationOptions(),
    );

    return ownerStoreList;
  }

  async findOwnerStoreByOwnerId(ownerId: number): Promise<any> {
    const owner: OwnerDTO = await this.findOneById(ownerId);
    if (!owner) throw new NotFoundException('등록되지 않은 사용자입니다.');
    if (owner.roleId !== OwnerRole.Store)
      throw new UnauthorizedException('점주 정보만 가져올 수 있습니다.');
    //this.logger.log('start findStoreByRoleId');
    const ownerStore = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .select([
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.phoneNumber',
        'owner.memo',
        'owner.status',
        'owner.createdAt',
        'store.id',
        'store.category',
        'store.name',
        'store.address1',
        'store.address2',
        'ownerImage.imageFileId',
        'imageFile.url',
      ])
      .leftJoin('owner.stores', 'store')
      .leftJoin('owner.ownerImages', 'ownerImage')
      .leftJoin('ownerImage.imageFile', 'imageFile')
      .where('owner.id = :oid', {
        oid: ownerId,
      })
      .getOne();
    // 점주 핸드폰번호 복호화
    const chpher = new DnggChpher();
    ownerStore.phoneNumber = await chpher.decrypt(ownerStore.phoneNumber);

    return ownerStore;
  }

  async findOwnerStoreByIds(ownerId: number, storeId: number): Promise<any> {
    const owner: OwnerDTO = await this.findOneById(ownerId);
    if (!owner) throw new NotFoundException('등록되지 않은 사용자입니다.');

    const ownerStore = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .select([
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.phoneNumber',
        'owner.memo',
        'owner.status',
        'owner.createdAt',
        'store.id',
        'store.category',
        'store.name',
        'store.address1',
        'store.address2',
        'ownerImage.imageFileId',
        'imageFile.url',
      ])
      .leftJoin('owner.stores', 'store')
      .leftJoin('owner.ownerImages', 'ownerImage')
      .leftJoin('ownerImage.imageFile', 'imageFile')
      .where('owner.id = :oid', {
        oid: ownerId,
      })
      .andWhere('store.id = :sid', {
        sid: storeId,
      })
      .getOne();
    // 점주 핸드폰번호 복호화
    const chpher = new DnggChpher();
    ownerStore.phoneNumber = await chpher.decrypt(ownerStore.phoneNumber);

    return ownerStore;
  }

  async updateOwnerStoreById(
    ownerStoreEditDTO: OwnerStoreEditDTO,
    ownerId: number,
  ): Promise<void> {
    const owner: OwnerDTO = await this.findOneById(ownerId);
    if (!owner) throw new NotFoundException('등록되지 않은 사용자입니다.');
    if (owner.roleId !== OwnerRole.Store)
      throw new UnauthorizedException('점주 정보만 수정할 수 있습니다.');

    const { memo, status } = ownerStoreEditDTO;
    let isConfirmed = false;
    if (status == OwnerStatus.Confirm) {
      isConfirmed = true;
    }
    try {
      await getConnection()
        .createQueryBuilder()
        .update(OwnerEntity)
        .set({ isConfirmed, status, memo })
        .where('owner.id = :oid', {
          oid: ownerId,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('confrimStoreById');
    }
  }

  async changePassword(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await getConnection()
        .createQueryBuilder()
        .update(OwnerEntity)
        .set({ password: hashedPassword })
        .where('owner.username = :ousername', {
          ousername: username,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('비밀번호 변경에 실패했습니다.');
    }
  }

  async changePhoneNumber(
    username: string,
    encryptedPhoneNumber: string,
  ): Promise<void> {
    try {
      await getConnection()
        .createQueryBuilder()
        .update(OwnerEntity)
        .set({ phoneNumber: encryptedPhoneNumber })
        .where('owner.username = :ousername', {
          ousername: username,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('휴대폰번호 변경에 실패했습니다.');
    }
  }
}
