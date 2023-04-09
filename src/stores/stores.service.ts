import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Not, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { StoreEntity } from '../common/entities/stores.entity';
import { StoreOpenHourEntity } from '../common/entities/store-open-hours.entity';
import { StoreBreakHourEntity } from '../common/entities/store-break-hours.entity';
import { StoreStopHourEntity } from '../common/entities/store-stop-hours.entity';
import { StoreImageEntity } from '../common/entities/store-images.entity';
import { OwnerEntity } from '../common/entities/owners.entity';
import { ImageFileEntity } from '../common/entities/image-files.entity';
import { CategoryStoreEntity } from '../common/entities/category-stores.entity';
import { DnggChpher } from '../common/utils/dnggCipher';
import { OwnerRole } from '../common/enums/owner-role';
import { DayOfWeek } from '../common/enums/day-of-week';
import { OpenSettingsType } from '../common/enums/open-settings-type';
import { OpenStatus } from '../common/enums/open-status';
import { RelayTo } from '../common/enums/relay-to';
import { StoreOwnerEditDTO } from './dtos/store-owner-edit.dto';
import { StoreOpenHourDTO } from './dtos/store-open-hour.dto';
import { StoreOpenHourDetailDTO } from './dtos/store-open-hour-detail.dto';
import { StoreOpenHourEditDTO } from './dtos/store-open-hour-edit.dto';
import { StoreOpenHourDetailEditDTO } from './dtos/store-open-hour-detail-edit.dto';
import { StoreBreakHourEditDTO } from './dtos/store-break-hour-edit.dto';
import { StoreStopHourDTO } from './dtos/store-stop-hour.dto';
import { StoreStopHourEditDTO } from './dtos/store-stop-hour-edit.dto';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { StoreOwnerSearchDTO } from './dtos/store-owner-search.dto';
import { StorePayTypeEntity } from 'src/common/entities/store-pay-type.entity';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    private readonly categoriesService: CategoriesService,
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
    @InjectRepository(StoreOpenHourEntity)
    private readonly storeOpenHoursRepository: Repository<StoreOpenHourEntity>,
    @InjectRepository(StoreBreakHourEntity)
    private readonly storeBreakHoursRepository: Repository<StoreBreakHourEntity>,
    @InjectRepository(StoreStopHourEntity)
    private readonly storeStopHoursRepository: Repository<StoreStopHourEntity>,
    @InjectRepository(StoreImageEntity)
    private readonly storeImagesRepository: Repository<StoreImageEntity>,
    @InjectRepository(ImageFileEntity)
    private readonly imageFilesRepository: Repository<ImageFileEntity>,
    @InjectRepository(CategoryStoreEntity)
    private readonly categoryStoresRepository: Repository<CategoryStoreEntity>,
    @InjectRepository(StorePayTypeEntity)
    private readonly storePayTypesRepository: Repository<StorePayTypeEntity>,
  ) {}

  async getStoreCountByOwnerId(ownerId: number): Promise<number> {
    //this.logger.log('getStoreCountByOwnerId');
    const { storeCount } = await getRepository(StoreEntity)
      .createQueryBuilder('store')
      .select('COUNT(store.id)', 'storeCount')
      .where('store.ownerId = :soid', { soid: ownerId })
      .getRawOne();

    //this.logger.log('storeCount: ' + storeCount);
    return storeCount;
  }

  async registerStoreOwners(): Promise<void> {
    // 임시로 가게 일괄 등록, 최대한 심플하게
    const owners = await getRepository(OwnerEntity)
      .createQueryBuilder('owner')
      .leftJoin('owner.stores', 'store')
      .where('owner.roleId = :orid', {
        orid: OwnerRole.Store,
      })
      .andWhere('store.id IS NULL')
      .getMany();

    for (let i = 0; i < owners.length; i++) {
      const ownerId = owners[i].id;
      await this.storesRepository.save({
        ownerId,
        openStatus: OpenStatus.Close,
        openSettingsType: OpenSettingsType.AllWeek,
        relayTo: RelayTo.FOODNET24,
      });
    }
  }

  async registerStoreByOwnerId(ownerId: number): Promise<void> {
    //this.logger.log('registerStoreByOwnerId');
    const store = await this.storesRepository.save({
      ownerId,
      openStatus: OpenStatus.Close,
      openSettingsType: OpenSettingsType.AllWeek,
      relayTo: RelayTo.FOODNET24,
    });

    /**
     * 가게에 추가되는 결제 방법 기본 정보 생성
     * 기본 결제는 앱 결제 + 매장에서 결제
     */
    for (let i = 1; i <= 2; i++) {
      await this.storePayTypesRepository.save({
        storeId: store.id,
        payType: i,
      });
    }
  }

  async findStoreOwners(
    storeOwnerSearchDTO: StoreOwnerSearchDTO,
  ): Promise<Pagination<any, IPaginationMeta>> {
    //this.logger.log('findStoreOwners');
    const queryBuilder = this.storesRepository.createQueryBuilder('store');
    queryBuilder.select([
      'store.id',
      'store.createdAt',
      'store.category',
      'store.name',
      'store.phoneNumber',
      'store.address1',
      'store.address2',
      'owner.id',
      'owner.username',
      'owner.fullName',
      'owner.phoneNumber',
      'owner.businessName',
      'owner.businessNumber',
    ]);
    queryBuilder.leftJoin('store.owner', 'owner');
    //queryBuilder.where('1 = 1');
    const { keyword } = storeOwnerSearchDTO;
    // 검색 조건
    if (keyword) {
      queryBuilder.where('store.name like :storeName', {
        storeName: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('store.createdAt', 'DESC');
    // 상점 리스트
    const storeOwnerList = paginate<any>(
      queryBuilder,
      storeOwnerSearchDTO.getIPaginationOptions(),
    );

    return storeOwnerList;
  }

  async findStoreOwnerByStoreId(storeId: number): Promise<any> {
    const store = await this.findOneById(storeId);
    if (!store)
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );

    const storeOwner = await getRepository(StoreEntity)
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.createdAt',
        'store.name',
        'store.phoneNumber',
        'store.address1',
        'store.address2',
        'store.minOrderPrice',
        'store.deliveryPrice',
        'store.deliveryArea',
        'store.origin',
        'store.hygiene',
        'store.instruction',
        'store.intro',
        'store.latitude',
        'store.longitude',
        'store.cookingTime',
        'store.relayTo',
        'categoryStore.categoryId',
        'category.name',
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.phoneNumber',
        'owner.businessName',
        'owner.businessNumber',
        'storeImage.imageFileId',
        'imageFile.url',
        'ownerImage.imageFileId',
        'oif.url',
      ])
      .leftJoin('store.categoryStores', 'categoryStore')
      .leftJoin('categoryStore.category', 'category')
      .leftJoin('store.owner', 'owner')
      .leftJoin('store.storeImages', 'storeImage')
      .leftJoin('storeImage.imageFile', 'imageFile')
      .leftJoin('owner.ownerImages', 'ownerImage')
      .leftJoin('ownerImage.imageFile', 'oif')
      .where('store.id = :sid', {
        sid: storeId,
      })
      .getOne();
    // 점주 핸드폰번호 복호화
    const chpher = new DnggChpher();
    storeOwner.owner.phoneNumber = await chpher.decrypt(
      storeOwner.owner.phoneNumber,
    );

    const findPayType = await this.storePayTypesRepository.find({ storeId });
    const payTypes = findPayType.map((a) => a.payType);

    const mergeStoreOwner = {};
    Object.assign(mergeStoreOwner, storeOwner, { payTypes });

    return mergeStoreOwner;
  }

  async findStoreOwnerByOwnerId(ownerId: number): Promise<any> {
    const storeOwner = await getRepository(StoreEntity)
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.createdAt',
        'store.name',
        'store.phoneNumber',
        'store.address1',
        'store.address2',
        'store.minOrderPrice',
        'store.deliveryPrice',
        'store.deliveryArea',
        'store.origin',
        'store.hygiene',
        'store.instruction',
        'store.intro',
        'store.latitude',
        'store.longitude',
        'store.cookingTime',
        'store.relayTo',
        'categoryStore.categoryId',
        'category.name',
        'owner.id',
        'owner.username',
        'owner.fullName',
        'owner.phoneNumber',
        'owner.businessName',
        'owner.businessNumber',
        'storeImage.imageFileId',
        'imageFile.url',
        'ownerImage.imageFileId',
        'oif.url',
      ])
      .leftJoin('store.categoryStores', 'categoryStore')
      .leftJoin('categoryStore.category', 'category')
      .leftJoin('store.owner', 'owner')
      .leftJoin('store.storeImages', 'storeImage')
      .leftJoin('storeImage.imageFile', 'imageFile')
      .leftJoin('owner.ownerImages', 'ownerImage')
      .leftJoin('ownerImage.imageFile', 'oif')
      .where('owner.id = :oid', {
        oid: ownerId,
      })
      .orderBy('categoryStore.createdAt', 'ASC')
      .getOne();
    // 점주 핸드폰번호 복호화
    const chpher = new DnggChpher();
    storeOwner.owner.phoneNumber = await chpher.decrypt(
      storeOwner.owner.phoneNumber,
    );

    const findPayType = await this.storePayTypesRepository.find({
      storeId: storeOwner.id,
    });
    const payTypes = findPayType.map((a) => a.payType);

    const mergeStoreOwner = {};
    Object.assign(mergeStoreOwner, storeOwner, { payTypes });

    return mergeStoreOwner;
  }

  async updateStoreOwnerByIds(
    storeOwnerEditDTO: StoreOwnerEditDTO,
    storeId: number,
    ownerId: number,
  ): Promise<void> {
    const {
      name,
      address1,
      address2,
      phoneNumber,
      minOrderPrice,
      deliveryPrice,
      deliveryArea,
      origin,
      hygiene,
      instruction,
      intro,
      cookingTime,
      relayTo,
      latitude,
      longitude,
      imageFileIds,
      payTypes,
    } = storeOwnerEditDTO;
    const { fullName, businessName, businessNumber } = storeOwnerEditDTO.owner;

    // 업종(카테고리) 연동
    // 1. categoryIds 체크
    const categoryIds = storeOwnerEditDTO.categoryIds;
    await this.categoriesService.validateCategoryInIds(categoryIds);
    // 2. 기존 storeId의 카테고리상점(CategoryStore) 연동 제거
    await this.categoryStoresRepository.softDelete({ storeId });
    // 3. storeId의 카테고리상점(CategoryStore) 연동 추가
    for (let i = 0; i < categoryIds.length; i++) {
      await this.categoryStoresRepository.save({
        storeId,
        categoryId: categoryIds[i],
      });
    }
    // 첫번째 카테고리 가져오기
    const category = await this.categoriesService.getValidatedCategoryById(
      categoryIds[0],
    );

    let coverImage1;
    for (let i = 0; i < imageFileIds.length; i++) {
      const imageFileId = imageFileIds[i];
      const imageFile = await this.imageFilesRepository.findOne({
        id: imageFileId,
      });
      if (!imageFile) {
        throw new NotFoundException(
          `해당 아이디의 이미지는 존재하지 않습니다, imageFileId: ${imageFileId}`,
        );
      }
      // 커버 이미지1 URL( 가게 이미지1 )
      if (i == 0) {
        coverImage1 = imageFile.url;
      }
    }

    // 가게 수정
    await getConnection()
      .createQueryBuilder()
      .update(StoreEntity)
      .set({
        category: category.name,
        name,
        address1,
        address2,
        phoneNumber,
        minOrderPrice,
        deliveryPrice,
        deliveryArea,
        origin,
        hygiene,
        instruction,
        intro,
        cookingTime,
        relayTo,
        latitude,
        longitude,
        coverImage1,
      })
      .where('store.id = :sid', {
        sid: storeId,
      })
      .execute();

    // 가게 결제 방법 일괄 삭제
    await this.storePayTypesRepository.delete({ storeId });
    // 가게 결제 방법 등록
    for (let i = 0; i < payTypes.length; i++) {
      const payType = payTypes[i];
      await this.storePayTypesRepository.save({
        storeId,
        payType,
      });
    }

    // 점주 수정
    await getConnection()
      .createQueryBuilder()
      .update(OwnerEntity)
      .set({
        fullName,
        businessName,
        businessNumber,
      })
      .where('owner.id = :oid', {
        oid: ownerId,
      })
      .execute();

    // 가게 사진 일괄 삭제
    await this.storeImagesRepository.softDelete({ storeId });
    // 가게 사진 등록(1-5장)
    for (let i = 0; i < imageFileIds.length; i++) {
      const imageFileId = imageFileIds[i];
      await this.storeImagesRepository.save({
        storeId,
        imageFileId,
      });
    }
  }

  async findStoreOpenHoursByStoreId(storeId: number): Promise<any> {
    const store = await this.findOneById(storeId);
    if (!store)
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );

    const storeOpenHourDetail: StoreOpenHourDetailDTO = await getRepository(
      StoreEntity,
    )
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.openStatus',
        'store.openSettingsType',
        'store.isBreakHours',
        'store.openHours',
        'store.breakHours',
        'store.restDays',
        'storeOpenHour.dayOfWeek',
        'storeOpenHour.isAllHours',
        'storeOpenHour.isRestDay',
        'storeOpenHour.openHour',
        'storeOpenHour.openMin',
        'storeOpenHour.closeHour',
        'storeOpenHour.closeMin',
        'storeBreakHour.startHour',
        'storeBreakHour.startMin',
        'storeBreakHour.endHour',
        'storeBreakHour.endMin',
      ])
      .leftJoin('store.storeOpenHours', 'storeOpenHour')
      .leftJoin('store.storeBreakHour', 'storeBreakHour')
      .where('store.id = :sid', {
        sid: storeId,
      })
      .getOne();

    const storeOpenHours: StoreOpenHourDTO[] = [];
    // this.logger.log('storeOpenHours.length: ' + storeOpenHourDetail.storeOpenHours.length);
    // 요일 데이터가 없는 경우
    if (storeOpenHourDetail.storeOpenHours.length === 0) {
      // 요일 데이터 생성
      const dayOfWeekValues = Object.values(DayOfWeek);
      for (let i = 0; i < dayOfWeekValues.length; i++) {
        const dayOfWeekValue = dayOfWeekValues[i];
        const storeOpenHour = await this.storeOpenHoursRepository.save({
          storeId,
          dayOfWeek: dayOfWeekValue,
          isAllHours: false,
          isRestDay: false,
          openHour: 0,
          openMin: 0,
          closeHour: 0,
          closeMin: 0,
        });
        storeOpenHours[i] = {
          dayOfWeek: storeOpenHour.dayOfWeek,
          isAllHours: storeOpenHour.isAllHours,
          isRestDay: storeOpenHour.isRestDay,
          openHour: storeOpenHour.openHour,
          openMin: storeOpenHour.openMin,
          closeHour: storeOpenHour.closeHour,
          closeMin: storeOpenHour.closeMin,
        };
      }
      storeOpenHourDetail.storeOpenHours = storeOpenHours;
    }
    // 휴게시간 데이터가 없는 경우
    if (!storeOpenHourDetail.storeBreakHour) {
      // 휴게시간 데이터 생성
      const storeBreakHour = await this.storeBreakHoursRepository.save({
        storeId,
        startHour: 0,
        startMin: 0,
        endHour: 0,
        endMin: 0,
      });
      storeOpenHourDetail.storeBreakHour = {
        startHour: storeBreakHour.startHour,
        startMin: storeBreakHour.startMin,
        endHour: storeBreakHour.endHour,
        endMin: storeBreakHour.endMin,
      };
    }

    return storeOpenHourDetail;
  }

  async updateStoreOpenHourListByStoreId(
    storeOpenHourDetailEditDTO: StoreOpenHourDetailEditDTO,
    storeId: number,
  ): Promise<void> {
    const store = await this.findOneById(storeId);
    if (!store)
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );

    const { openSettingsType, isBreakHours } = storeOpenHourDetailEditDTO;
    const storeOpenHours: StoreOpenHourEditDTO[] =
      storeOpenHourDetailEditDTO.storeOpenHours;
    const dayOfWeekValues = Object.values(DayOfWeek);
    // 영업시간 요일(monday|tuesday|wednesday|thursday|friday|saturday|sunday) 체크
    for (let i = 0; i < dayOfWeekValues.length; i++) {
      const dayOfWeekValue = dayOfWeekValues[i];
      const storeOpenHour = storeOpenHours[i];
      const dayOfWeek = storeOpenHour.dayOfWeek;
      if (dayOfWeek !== dayOfWeekValue) {
        throw new BadRequestException(
          `요일이 일치하지 않습니다. 원본: ${dayOfWeekValue}, 입력: ${dayOfWeek}`,
        );
      }
    }
    // 영업시간 수정
    let isRestDays = false;
    let openHours = null;
    let breakHours = null;
    let restDays = null;
    if (!isBreakHours) {
      breakHours = '별도 휴게시간 없음';
    }
    for (let i = 0; i < storeOpenHours.length; i++) {
      const storeOpenHour = storeOpenHours[i];
      const isRestDay = storeOpenHour.isRestDay;
      // 휴무요일이 하루라도 있으면 휴우요일 있음 설정
      if (isRestDay) {
        isRestDays = true;
      }
    }
    if (isRestDays) {
      restDays = '매주';
    } else {
      restDays = '연중무휴';
    }
    for (let i = 0; i < storeOpenHours.length; i++) {
      const storeOpenHour = storeOpenHours[i];
      const dayOfWeek = storeOpenHour.dayOfWeek;
      const isAllHours = storeOpenHour.isAllHours;
      const isRestDay = storeOpenHour.isRestDay;
      const openHour = isAllHours || isRestDay ? 0 : storeOpenHour.openHour;
      const openMin = isAllHours || isRestDay ? 0 : storeOpenHour.openMin;
      const closeHour = isAllHours || isRestDay ? 0 : storeOpenHour.closeHour;
      const closeMin = isAllHours || isRestDay ? 0 : storeOpenHour.closeMin;
      await this.storeOpenHoursRepository.update(
        { storeId, dayOfWeek },
        { isAllHours, isRestDay, openHour, openMin, closeHour, closeMin },
      );
      // 영업시간
      let openHourStr;
      if (openHour < 10) {
        openHourStr = '0' + openHour;
      } else {
        openHourStr = '' + openHour;
      }
      let openMinStr;
      if (openMin < 10) {
        openMinStr = '0' + openMin;
      } else {
        openMinStr = '' + openMin;
      }
      let closeHourStr;
      if (closeHour < 10) {
        closeHourStr = '0' + closeHour;
      } else {
        closeHourStr = '' + closeHour;
      }
      let closeMinStr;
      if (closeMin < 10) {
        closeMinStr = '0' + closeMin;
      } else {
        closeMinStr = '' + closeMin;
      }
      let openHoursStr =
        openHourStr +
        ':' +
        openMinStr +
        ' ~ ' +
        closeHourStr +
        ':' +
        closeMinStr;
      // 24시간 영업일 경우
      if (isAllHours) {
        openHoursStr = '24시간 영업';
      }
      switch (dayOfWeek) {
        case DayOfWeek.Monday:
          // 평일/주말동일, 평일/주말구분의 경우 월요일 기준 세팅
          if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours = '월요일' + ' - ' + openHoursStr;
          } else if (openSettingsType === OpenSettingsType.Weekday) {
            openHours = '평일' + ' - ' + openHoursStr;
          } else if (openSettingsType === OpenSettingsType.AllWeek) {
            openHours = '매일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 월요일';
          }
          break;
        case DayOfWeek.Tuesday:
          if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours += ',' + '화요일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 화요일';
          }
          break;
        case DayOfWeek.Wednesday:
          if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours += ',' + '수요일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 수요일';
          }
          break;
        case DayOfWeek.Thursday:
          if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours += ',' + '목요일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 목요일';
          }
          break;
        case DayOfWeek.Friday:
          if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours += ',' + '금요일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 금요일';
          }
          break;
        case DayOfWeek.Saturday:
          // 평일/주말구분의 경우 토요일 기준 주말 세팅
          if (openSettingsType === OpenSettingsType.Weekday) {
            openHours += ',' + '주말' + ' - ' + openHoursStr;
          } else if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours += ',' + '토요일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 토요일';
          }
          break;
        case DayOfWeek.Sunday:
          if (openSettingsType === OpenSettingsType.DayOfWeek) {
            openHours += ',' + '일요일' + ' - ' + openHoursStr;
          }
          if (isRestDay) {
            restDays += ' 일요일';
          }
          break;
        default:
          break;
      }
    }
    // 휴게시간 수정
    if (isBreakHours) {
      const storeBreakHour: StoreBreakHourEditDTO =
        storeOpenHourDetailEditDTO.storeBreakHour;
      const startHour = storeBreakHour.startHour;
      const startMin = storeBreakHour.startMin;
      const endHour = storeBreakHour.endHour;
      const endMin = storeBreakHour.endMin;
      await this.storeBreakHoursRepository.update(
        { storeId },
        { startHour, startMin, endHour, endMin },
      );
      let startHourStr;
      if (startHour < 10) {
        startHourStr = '0' + startHour;
      } else {
        startHourStr = '' + startHour;
      }
      let startMinStr;
      if (startMin < 10) {
        startMinStr = '0' + startMin;
      } else {
        startMinStr = '' + startMin;
      }
      let endHourStr;
      if (endHour < 10) {
        endHourStr = '0' + endHour;
      } else {
        endHourStr = '' + endHour;
      }
      let endMinStr;
      if (endMin < 10) {
        endMinStr = '0' + endMin;
      } else {
        endMinStr = '' + endMin;
      }
      breakHours =
        startHourStr + ':' + startMinStr + ' ~ ' + endHourStr + ':' + endMinStr;
    }
    // 영업시간설정 구분, 휴게시간 유무, 휴무요일 유무, 영업시간, 휴게(준비)시간, 휴무일
    await this.storesRepository.update(storeId, {
      openSettingsType,
      isBreakHours,
      isRestDays,
      openHours,
      breakHours,
      restDays,
    });
  }

  async findStoreStopHourByStoreId(storeId: number): Promise<StoreStopHourDTO> {
    const store = await this.findOneById(storeId);
    if (!store)
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );

    const today = this.formatToday();
    let storeStopHour: StoreStopHourDTO = await getRepository(
      StoreStopHourEntity,
    )
      .createQueryBuilder('storeStopHour')
      .select([
        'storeStopHour.id',
        'storeStopHour.isNotSettings',
        'storeStopHour.message',
        'storeStopHour.startHour',
        'storeStopHour.startMin',
        'storeStopHour.endHour',
        'storeStopHour.endMin',
      ])
      .leftJoin('storeStopHour.store', 'store')
      .where('store.id = :sid', {
        sid: storeId,
      })
      .andWhere('storeStopHour.date = :sohdate', {
        sohdate: today,
      })
      .getOne();

    if (storeStopHour) {
      // 이전 날짜 데이터 삭제
      await this.storeStopHoursRepository.softDelete({
        storeId,
        date: Not(today),
      });
    } else {
      // 오늘 날짜 데이터 생성
      const storeStopHourResult = await this.storeStopHoursRepository.save({
        storeId,
        isNotSettings: false,
        message: '가게사정',
        date: this.formatToday(),
        startHour: 0,
        startMin: 0,
        endHour: 0,
        endMin: 0,
      });
      storeStopHour = {
        id: storeStopHourResult.id,
        isNotSettings: storeStopHourResult.isNotSettings,
        message: storeStopHourResult.message,
        startHour: storeStopHourResult.startHour,
        startMin: storeStopHourResult.startMin,
        endHour: storeStopHourResult.endHour,
        endMin: storeStopHourResult.endMin,
      };
    }

    return storeStopHour;
  }

  async updateStoreStopHourByStoreId(
    storeStopHourEditDTO: StoreStopHourEditDTO,
    storeId: number,
  ): Promise<void> {
    const store = await this.findOneById(storeId);
    if (!store) {
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );
    }

    const { isStop, isNotSettings, message } = storeStopHourEditDTO;
    const startHour = isNotSettings ? 0 : storeStopHourEditDTO.startHour;
    const startMin = isNotSettings ? 0 : storeStopHourEditDTO.startMin;
    const endHour = isNotSettings ? 0 : storeStopHourEditDTO.endHour;
    const endMin = isNotSettings ? 0 : storeStopHourEditDTO.endMin;
    const today = this.formatToday();
    await this.storeStopHoursRepository.update(
      {
        storeId,
        date: today,
      },
      {
        isNotSettings,
        message,
        startHour,
        startMin,
        endHour,
        endMin,
      },
    );
    if (isStop) {
      await this.storesRepository.update(storeId, {
        openStatus: OpenStatus.Stop,
      });
    } else {
      await this.storesRepository.update(storeId, {
        openStatus: OpenStatus.Open,
      });
    }
  }

  async updateStoreStatusByStoreId(
    openStatus: OpenStatus,
    storeId: number,
  ): Promise<void> {
    const store = await this.findOneById(storeId);
    if (!store) {
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );
    }

    await this.storesRepository.update(storeId, {
      openStatus,
    });
  }

  async updateStoreRelayToByStoreId(
    relayTo: RelayTo,
    storeId: number,
  ): Promise<void> {
    const store = await this.findOneById(storeId);
    if (!store) {
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( id: ${storeId} )`,
      );
    }

    await this.storesRepository.update(storeId, {
      relayTo,
    });
  }

  private formatToday() {
    const date = new Date();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }

  async validateStore(storeId: number): Promise<void> {
    const store = await this.findOneById(storeId);
    if (!store) {
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( storeId: ${storeId} )`,
      );
    }
  }

  async validatedStore(storeId: number): Promise<any> {
    const store = await this.findOneById(storeId);
    if (!store) {
      throw new NotFoundException(
        `등록되지 않은 가게입니다.( storeId: ${storeId} )`,
      );
    }

    return store;
  }

  async getStoreOwners(): Promise<any> {
    const queryBuilder = this.storesRepository.createQueryBuilder('s');
    queryBuilder.select([
      's.id AS storeId',
      's.name AS storeName',
      'o.businessName AS businessName',
      'o.businessNumber AS businessNumber',
    ]);
    queryBuilder.leftJoin('s.owner', 'o');
    const storeOwners = await queryBuilder.getRawMany();

    return storeOwners;
  }

  async findOneById(id: number): Promise<any> {
    return await this.storesRepository.findOne({ id });
  }
}
