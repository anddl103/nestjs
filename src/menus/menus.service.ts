import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, In, Not, Repository } from 'typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { StoresService } from '../stores/stores.service';
import { MenuGroupsService } from '../menu-groups/menu-groups.service';
import { OptionGroupsService } from '../option-groups/option-groups.service';
import { MenuEntity } from '../common/entities/menus.entity';
import { MenuPriceEntity } from '../common/entities/menu-prices.entity';
import { MenuImageEntity } from '../common/entities/menu-images.entity';
import { MenuSignatureEntity } from '../common/entities/menu-signatures.entity';
import { ImageFileEntity } from '../common/entities/image-files.entity';
import { MenuOptionGroupEntity } from '../common/entities/menu-opton-groups.entity';
import { MenuSearchDTO } from './dtos/menu-search.dto';
import { MenuPriceRegisterDTO } from './dtos/menu-price-reg.dto';
import { MenuRegisterDTO } from './dtos/menu-reg.dto';
import { MenuDTO } from './dtos/menu.dto';
import { MenuDetailDTO } from './dtos/menu-detail.dto';
import { MenuEditDTO } from './dtos/menu-edit.dto';
import { MenuImageDTO } from './dtos/menu-image.dto';
import { MenuPriceDTO } from './dtos/menu-price.dto';
import { MenuSignatureDTO } from './dtos/menu-signature.dto';
import { MenuPopularDTO } from './dtos/menu-popular.dto';
import { MenuSoldoutDTO } from './dtos/menu-soldout.dto';

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name);

  constructor(
    private readonly storesService: StoresService,
    private readonly menuGroupsService: MenuGroupsService,
    private readonly optionGroupsService: OptionGroupsService,
    @InjectRepository(MenuEntity)
    private readonly menusRepository: Repository<MenuEntity>,
    @InjectRepository(MenuImageEntity)
    private readonly menuImagesRepository: Repository<MenuImageEntity>,
    @InjectRepository(MenuPriceEntity)
    private readonly menuPricesRepository: Repository<MenuPriceEntity>,
    @InjectRepository(MenuSignatureEntity)
    private readonly menuSignaturesRepository: Repository<MenuSignatureEntity>,
    @InjectRepository(MenuOptionGroupEntity)
    private readonly menuOptionGroupsRepository: Repository<MenuOptionGroupEntity>,
    @InjectRepository(ImageFileEntity)
    private readonly imageFilesRepository: Repository<ImageFileEntity>,
  ) {}

  async findMenusBySearch(
    menuSearchDTO: MenuSearchDTO,
  ): Promise<Pagination<any, IPaginationMeta>> {
    const { storeId, menuGroupId, keyword } = menuSearchDTO;
    // menuGroupId 체크
    if (menuGroupId > 0) {
      await this.menuGroupsService.getValidatedMenuGroupByIds(
        menuGroupId,
        storeId,
      );
    } else {
      await this.storesService.validateStore(storeId);
    }
    const queryBuilder = this.menusRepository.createQueryBuilder('menu');
    queryBuilder.select([
      'menu.id',
      'menu.createdAt',
      'menu.name',
      'menu.menuGroupId',
      'menu.menuGroupName',
      'menu.menuImage',
      'menu.basePrice',
      'menu.requiredOption',
      'menu.optionalOption',
      'menu.isSignature',
      'menu.isPopular',
      'menu.isSoldout',
      'menu.position',
    ]);
    queryBuilder.where('menu.storeId = :msid', {
      msid: storeId,
    });
    // menuGroupId 가 0 일 경우 전체 메뉴
    if (menuGroupId > 0) {
      queryBuilder.andWhere('menu.menuGroupId = :mmgid', {
        mmgid: menuGroupId,
      });
    }
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('menu.name like :menuName', {
        menuName: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('menu.createdAt', 'DESC');
    // 메뉴 리스트
    const menuList = paginate<any>(
      queryBuilder,
      menuSearchDTO.getIPaginationOptions(),
    );

    return menuList;
  }

  async registerMenu(
    storeId: number,
    menuRegisterDTO: MenuRegisterDTO,
  ): Promise<void> {
    const {
      menuGroupId,
      name,
      description,
      isSignature,
      isPopular,
      isSoldout,
      isDonation,
      imageFileId,
    } = menuRegisterDTO;
    const menuPrices: MenuPriceRegisterDTO[] = menuRegisterDTO.menuPrices;
    const requiredOptionIds: number[] = menuRegisterDTO.requiredOptionIds;
    const optionalOptionIds: number[] = menuRegisterDTO.optionalOptionIds;

    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 가게 > 메뉴명 중복체크
    await this.validateMenuNameByStoreId(storeId, name);
    // 대표메뉴 항목 체크 - 최대 5개
    const signatureMenuCount = await this.countSignatureMenuByStoreId(storeId);
    if (isSignature && signatureMenuCount === 5) {
      throw new BadRequestException(
        `대표메뉴는 최대 5개까지만 설정 가능합니다.`,
      );
    }
    // 인기메뉴 항목 체크 - 최대 5개
    const popularMenuCount = await this.countPopularMenuByStoreId(storeId);
    if (isPopular && popularMenuCount === 5) {
      throw new BadRequestException(
        `인기메뉴는 최대 5개까지만 설정 가능합니다.`,
      );
    }
    // 메뉴그룹 아이디 체크 및 메뉴그룹명 가져오기
    const menuGroupName = await this.menuGroupsService.getMenuGroupNameById(
      menuGroupId,
    );
    // 메뉴이미지 파일체크
    let menuImage = null;
    if (imageFileId !== undefined) {
      const imageFile = await this.imageFilesRepository.findOne({
        id: imageFileId,
      });
      if (!imageFile) {
        throw new NotFoundException(
          `해당 아이디의 이미지는 존재하지 않습니다, imageFileId: ${imageFileId}`,
        );
      }
      // 메뉴이미지 URL
      menuImage = imageFile.url;
    }
    // 필수 옵션그룹 아이디 체크
    let requiredOption = 0;
    if (requiredOptionIds !== undefined && requiredOptionIds.length > 0) {
      requiredOption = requiredOptionIds.length;
      for (let i = 0; i < requiredOptionIds.length; i++) {
        const optionGroupId: number = requiredOptionIds[i];
        await this.optionGroupsService.validateOptionGroupIsRequired(
          optionGroupId,
          storeId,
          true,
        );
      }
    }
    // 선택 옵션그룹 아이디 체크
    let optionalOption = 0;
    if (optionalOptionIds !== undefined && optionalOptionIds.length > 0) {
      optionalOption = optionalOptionIds.length;
      for (let i = 0; i < optionalOptionIds.length; i++) {
        const optionGroupId: number = optionalOptionIds[i];
        await this.optionGroupsService.validateOptionGroupIsRequired(
          optionGroupId,
          storeId,
          false,
        );
      }
    }
    // position 설정 ( 메뉴그룹 안에서의 노출순서 )
    const menuCount = await this.countMenuByIds(storeId, menuGroupId);
    const position = menuCount + 1;
    // 기본가격
    const basePrice = menuPrices[0].price;
    // 메뉴 저장
    const menu = await this.menusRepository.save({
      storeId,
      menuGroupId,
      menuGroupName,
      name,
      description,
      isSignature,
      isPopular,
      isSoldout,
      isDonation,
      basePrice,
      requiredOption,
      optionalOption,
      menuImage,
      position,
    });
    // 메뉴이미지 저장
    const menuId = menu.id;
    if (imageFileId !== undefined) {
      await this.menuImagesRepository.save({ menuId, imageFileId });
    }
    // 메뉴가격 저장
    for (let i = 0; i < menuPrices.length; i++) {
      const menuPrice = menuPrices[i];
      const { name, discount, price } = menuPrice;
      await this.menuPricesRepository.save({ menuId, name, discount, price });
    }
    // 대표메뉴 ( menuSignature ) 저장
    if (isSignature) {
      const menuSignatureCount = await this.menuSignaturesRepository.count({
        storeId,
      });
      await this.menuSignaturesRepository.save({
        storeId,
        menuId,
        position: menuSignatureCount + 1,
      });
    }
    // 메뉴옵션그룹 저장 ( 필수 옵션그룹 )
    if (requiredOption > 0) {
      for (let i = 0; i < requiredOptionIds.length; i++) {
        const optionGroupId: number = requiredOptionIds[i];
        await this.menuOptionGroupsRepository.save({ menuId, optionGroupId });
      }
    }
    // 메뉴옵션그룹 저장 ( 선택 옵션그룹 )
    if (optionalOption > 0) {
      for (let i = 0; i < optionalOptionIds.length; i++) {
        const optionGroupId: number = optionalOptionIds[i];
        await this.menuOptionGroupsRepository.save({ menuId, optionGroupId });
      }
    }
    // 메뉴그룹 > 메뉴수 증가
    await this.menuGroupsService.incrementMenuCountById(menuGroupId);
  }

  async findMenuById(id: number): Promise<MenuDetailDTO> {
    const menu = await getRepository(MenuEntity)
      .createQueryBuilder('menu')
      .select([
        'menu.id',
        'menu.createdAt',
        'menu.storeId',
        'menu.menuGroupId',
        'menu.name',
        'menu.description',
        'menu.isSignature',
        'menu.isPopular',
        'menu.isSoldout',
        'menu.isDonation',
        'menuImage.imageFileId',
        'imageFile.url',
        'menuPrice.id',
        'menuPrice.name',
        'menuPrice.discount',
        'menuPrice.price',
      ])
      .leftJoin('menu.menuImages', 'menuImage')
      .leftJoin('menuImage.imageFile', 'imageFile')
      .leftJoin('menu.menuPrices', 'menuPrice')
      .where('menu.id = :mid', {
        mid: id,
      })
      .orderBy('menuPrice.id', 'ASC')
      .getOne();
    // menuOptionGroup 연동
    const menuOptionGroups = await getRepository(MenuOptionGroupEntity)
      .createQueryBuilder('menuOptionGroup')
      .select([
        'menuOptionGroup.id',
        'menuOptionGroup.menuId',
        'menuOptionGroup.optionGroupId',
        'optionGroup.isRequired',
      ])
      .leftJoin('menuOptionGroup.optionGroup', 'optionGroup')
      .where('menuOptionGroup.menuId = :mogmid', {
        mogmid: id,
      })
      .orderBy('optionGroup.position', 'ASC')
      .getMany();
    // 필수 옵션그룹 아이디 리스트, 선택 옵션그룹 아이디 리스트 ( isRequired 로 구분 )
    const requiredOptionIds = [];
    const optionalOptionIds = [];
    for (let i = 0; i < menuOptionGroups.length; i++) {
      const menuOptionGroup = menuOptionGroups[i];
      const optionGroupId = menuOptionGroup.optionGroupId;
      const isRequired = menuOptionGroup.optionGroup.isRequired;
      if (isRequired) {
        requiredOptionIds.push(optionGroupId);
      } else {
        optionalOptionIds.push(optionGroupId);
      }
    }

    const menuDetail: MenuDetailDTO = {
      ...menu,
      requiredOptionIds,
      optionalOptionIds,
    };

    return menuDetail;
  }

  async updateMenuById(
    id: number,
    storeId: number,
    originalMenu: MenuDTO,
    menuEditDTO: MenuEditDTO,
  ): Promise<void> {
    const {
      menuGroupId,
      name,
      description,
      isSignature,
      isPopular,
      isSoldout,
      isDonation,
      imageFileId,
    } = menuEditDTO;
    const menuPrices: MenuPriceRegisterDTO[] = menuEditDTO.menuPrices;
    const requiredOptionIds: number[] = menuEditDTO.requiredOptionIds;
    const optionalOptionIds: number[] = menuEditDTO.optionalOptionIds;
    // 대표메뉴 항목 체크 - 최대 5개 ( 수정할 메뉴 아이디 제외 )
    const signatureMenuCount = await this.countSignatureMenuNotId(id, storeId);
    if (isSignature && signatureMenuCount === 5) {
      throw new BadRequestException(
        `대표메뉴는 최대 5개까지만 설정 가능합니다.`,
      );
    }
    // 인기메뉴 항목 체크 - 최대 5개 ( 수정할 메뉴 아이디 제외 )
    const popularMenuCount = await this.countPopularMenuNotId(id, storeId);
    if (isPopular && popularMenuCount === 5) {
      throw new BadRequestException(
        `인기메뉴는 최대 5개까지만 설정 가능합니다.`,
      );
    }
    // 메뉴그룹 아이디 체크 및 엔티티 호출
    const menuGroup = await this.menuGroupsService.getValidatedMenuGroupByIds(
      menuGroupId,
      storeId,
    );
    // 메뉴그룹명 가져오기
    const menuGroupName = menuGroup.name;
    // 원본 메뉴명하고 비교
    if (name !== originalMenu.name) {
      // 가게 > 메뉴명 중복체크
      await this.validateMenuNameByStoreId(storeId, name);
    }
    // 메뉴이미지 파일체크
    let isMenuImage = false;
    let menuImage;
    let originalImageFileId = 0;
    const originalMenuImage: MenuImageDTO = await this.getMenuImageByMenuId(id);
    if (originalMenuImage) {
      originalImageFileId = originalMenuImage.imageFileId;
    }
    if (imageFileId !== undefined) {
      // 원본 이미지파일 아이디하고 비교
      if (imageFileId !== originalImageFileId) {
        const imageFile = await this.imageFilesRepository.findOne({
          id: imageFileId,
        });
        if (!imageFile) {
          throw new NotFoundException(
            `해당 아이디의 이미지는 존재하지 않습니다, imageFileId: ${imageFileId}`,
          );
        }
        // 메뉴이미지 URL ( 수정 )
        menuImage = imageFile.url;
        isMenuImage = true;
      } else {
        // 메뉴이미지 URL ( 유지 )
        //menuImage = originalImageFileId;
      }
    }
    // 필수 옵션그룹 아이디 체크
    let requiredOption = 0;
    if (requiredOptionIds !== undefined && requiredOptionIds.length > 0) {
      requiredOption = requiredOptionIds.length;
      for (let i = 0; i < requiredOptionIds.length; i++) {
        const optionGroupId: number = requiredOptionIds[i];
        await this.optionGroupsService.validateOptionGroupIsRequired(
          optionGroupId,
          storeId,
          true,
        );
      }
    }
    // 선택 옵션그룹 아이디 체크
    let optionalOption = 0;
    if (optionalOptionIds !== undefined && optionalOptionIds.length > 0) {
      optionalOption = optionalOptionIds.length;
      for (let i = 0; i < optionalOptionIds.length; i++) {
        const optionGroupId: number = optionalOptionIds[i];
        await this.optionGroupsService.validateOptionGroupIsRequired(
          optionGroupId,
          storeId,
          false,
        );
      }
    }
    // 기본가격
    const basePrice = menuPrices[0].price;
    // 메뉴 수정
    if (isMenuImage) {
      await getConnection()
        .createQueryBuilder()
        .update(MenuEntity)
        .set({
          menuGroupId,
          menuGroupName,
          name,
          description,
          isSignature,
          isPopular,
          isSoldout,
          isDonation,
          basePrice,
          requiredOption,
          optionalOption,
          menuImage,
        })
        .where('menu.id = :mid', {
          mid: id,
        })
        .execute();
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(MenuEntity)
        .set({
          menuGroupId,
          menuGroupName,
          name,
          description,
          isSignature,
          isPopular,
          isSoldout,
          isDonation,
          basePrice,
          requiredOption,
          optionalOption,
        })
        .where('menu.id = :mid', {
          mid: id,
        })
        .execute();
    }

    if (imageFileId !== undefined && imageFileId !== originalImageFileId) {
      if (originalImageFileId > 0) {
        // 메뉴이미지 수정
        const menuImageId = originalMenuImage.id;
        await this.menuImagesRepository.update(menuImageId, {
          menuId: id,
          imageFileId,
        });
      } else {
        // 메뉴이미지 저장
        await this.menuImagesRepository.save({ menuId: id, imageFileId });
      }
    }
    // 메뉴가격은 앱쪽 API 에서 아이디 연동이 많기 때문에 최대한 분기 처리
    const originalMenuPrices = await this.getMenuPricesByMenuId(id);
    if (menuPrices.length === originalMenuPrices.length) {
      for (let i = 0; i < menuPrices.length; i++) {
        const menuPrice = menuPrices[i];
        const { name, discount, price } = menuPrice;
        const originalMenuPrice = originalMenuPrices[i];
        const originalMenuPriceId = originalMenuPrice.id;
        // 메뉴가격 수정
        await this.menuPricesRepository.update(originalMenuPriceId, {
          name,
          discount,
          price,
        });
      }
    } else if (menuPrices.length > originalMenuPrices.length) {
      for (let i = 0; i < menuPrices.length; i++) {
        const menuPrice = menuPrices[i];
        const { name, discount, price } = menuPrice;
        if (originalMenuPrices[i]) {
          const originalMenuPrice = originalMenuPrices[i];
          const originalMenuPriceId = originalMenuPrice.id;
          // 메뉴가격 수정
          await this.menuPricesRepository.update(originalMenuPriceId, {
            name,
            discount,
            price,
          });
        } else {
          // 메뉴가격 저장
          await this.menuPricesRepository.save({
            menuId: id,
            name,
            discount,
            price,
          });
        }
      }
    } else if (menuPrices.length < originalMenuPrices.length) {
      for (let i = 0; i < originalMenuPrices.length; i++) {
        const originalMenuPrice = originalMenuPrices[i];
        const originalMenuPriceId = originalMenuPrice.id;
        if (menuPrices[i]) {
          const menuPrice = menuPrices[i];
          const { name, discount, price } = menuPrice;
          // 메뉴가격 수정
          await this.menuPricesRepository.update(originalMenuPriceId, {
            name,
            discount,
            price,
          });
        } else {
          // 메뉴가격 삭제
          await this.menuPricesRepository.softDelete(originalMenuPriceId);
        }
      }
    }
    // 메뉴옵션그룹 삭제 ( 메뉴옵션그룹 아이디는 조인문에만 사용되기 때문에 삭제해도 영향이 없음 )
    await this.menuOptionGroupsRepository.softDelete({ menuId: id });
    // 메뉴옵션그룹 저장 ( 필수 옵션그룹 )
    if (requiredOption > 0) {
      for (let i = 0; i < requiredOptionIds.length; i++) {
        const optionGroupId: number = requiredOptionIds[i];
        await this.menuOptionGroupsRepository.save({
          menuId: id,
          optionGroupId,
        });
      }
    }
    // 메뉴옵션그룹 저장 ( 선택 옵션그룹 )
    if (optionalOption > 0) {
      for (let i = 0; i < optionalOptionIds.length; i++) {
        const optionGroupId: number = optionalOptionIds[i];
        await this.menuOptionGroupsRepository.save({
          menuId: id,
          optionGroupId,
        });
      }
    }
  }

  async updateSignatureMenusById(
    storeId: number,
    menuSignatureDTO: MenuSignatureDTO,
  ): Promise<void> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 대표메뉴 아이디 체크
    const { menuIds } = menuSignatureDTO;
    const menus = await this.getMenusInIds(menuIds, storeId);
    for (let i = 0; i < menuIds.length; i++) {
      const menuId = menuIds[i];
      let isExist = false;
      for (let j = 0; j < menus.length; j++) {
        const menu = menus[j];
        if (menuId === menu.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        throw new NotFoundException(
          `해당 아이디의 메뉴는 존재하지 않습니다, storeId: ${storeId}, menuId: ${menuId}`,
        );
      }
    }
    // 대표메뉴 아이디 업뎃
    await this.menusRepository.update(
      { id: In(menuIds) },
      { isSignature: true },
    );
    await this.menusRepository.update(
      { id: Not(In(menuIds)) },
      { isSignature: false },
    );
    // 대표메뉴 ( menuSignature ) 삭제
    await this.menuSignaturesRepository.softDelete({ storeId });
    // 대표메뉴 ( menuSignature ) 저장
    for (let i = 0; i < menuIds.length; i++) {
      const menuId = menuIds[i];
      await this.menuSignaturesRepository.save({
        storeId,
        menuId,
        position: i + 1,
      });
    }
  }

  async updatePopularMenusById(
    storeId: number,
    menuPopularDTO: MenuPopularDTO,
  ): Promise<void> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 인기메뉴 아이디 체크
    const { menuIds } = menuPopularDTO;
    const menus = await this.getMenusInIds(menuIds, storeId);
    for (let i = 0; i < menuIds.length; i++) {
      const menuId = menuIds[i];
      let isExist = false;
      for (let j = 0; j < menus.length; j++) {
        const menu = menus[j];
        if (menuId === menu.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        throw new NotFoundException(
          `해당 아이디의 메뉴는 존재하지 않습니다, storeId: ${storeId}, menuId: ${menuId}`,
        );
      }
    }
    // 인기메뉴 아이디 업뎃
    await this.menusRepository.update({ id: In(menuIds) }, { isPopular: true });
    await this.menusRepository.update(
      { id: Not(In(menuIds)) },
      { isPopular: false },
    );
  }

  async updateSoldoutMenusById(
    storeId: number,
    menuSoldoutDTO: MenuSoldoutDTO,
  ): Promise<void> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 인기메뉴 아이디 체크
    const { menuIds } = menuSoldoutDTO;
    const menus = await this.getMenusInIds(menuIds, storeId);
    for (let i = 0; i < menuIds.length; i++) {
      const menuId = menuIds[i];
      let isExist = false;
      for (let j = 0; j < menus.length; j++) {
        const menu = menus[j];
        if (menuId === menu.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        throw new NotFoundException(
          `해당 아이디의 메뉴는 존재하지 않습니다, storeId: ${storeId}, menuId: ${menuId}`,
        );
      }
    }
    // 품절처리 메뉴 아이디 업뎃
    await this.menusRepository.update({ id: In(menuIds) }, { isSoldout: true });
    await this.menusRepository.update(
      { id: Not(In(menuIds)) },
      { isSoldout: false },
    );
  }

  async deleteMenuById(id: number, menuGroupId: number): Promise<void> {
    // 메뉴 삭제
    await getConnection()
      .createQueryBuilder()
      .softDelete()
      .from(MenuEntity)
      .where('menu.id = :mid', {
        mid: id,
      })
      .execute();
    // 메뉴그룹 > 메뉴수 감소
    await this.menuGroupsService.decrementMenuCountById(menuGroupId);
  }

  async getMenusInIds(ids: number[], storeId: number): Promise<MenuDTO[]> {
    const menus: MenuDTO[] = await this.menusRepository.find({
      id: In(ids),
      storeId,
    });
    return menus;
  }

  async getMenuPricesByMenuId(menuId: number): Promise<MenuPriceDTO[]> {
    const menuPrices: MenuPriceDTO[] = await this.menuPricesRepository.find({
      menuId,
    });
    return menuPrices;
  }

  async getMenuImageByMenuId(menuId: number): Promise<MenuImageDTO> {
    const menuImages: MenuImageDTO[] = await this.menuImagesRepository.find({
      menuId,
    });
    if (menuImages[0]) {
      return menuImages[0];
    }
    return null;
  }

  async countSignatureMenuByStoreId(storeId: number): Promise<number> {
    return await this.menusRepository.count({ storeId, isSignature: true });
  }

  async countSignatureMenuNotId(id: number, storeId: number): Promise<number> {
    return await this.menusRepository.count({
      id: Not(id),
      storeId,
      isSignature: true,
    });
  }

  async countPopularMenuByStoreId(storeId: number): Promise<number> {
    return await this.menusRepository.count({ storeId, isPopular: true });
  }

  async countPopularMenuNotId(id: number, storeId: number): Promise<number> {
    return await this.menusRepository.count({
      id: Not(id),
      storeId,
      isPopular: true,
    });
  }

  async countMenuByMenuGroupId(menuGroupId: number): Promise<number> {
    return await this.menusRepository.count({ menuGroupId });
  }

  async countMenuByIds(storeId: number, menuGroupId: number): Promise<number> {
    return await this.menusRepository.count({ storeId, menuGroupId });
  }

  async validateMenuNameByStoreId(
    storeId: number,
    name: string,
  ): Promise<void> {
    const menu = await this.menusRepository.findOne({
      storeId,
      name,
    });
    if (menu)
      throw new ConflictException(
        `이미 생성된 메뉴명입니다.( storeId: ${storeId}, name: ${name} )`,
      );
  }

  async getValidatedMenuByIds(id: number, storeId: number): Promise<MenuDTO> {
    const menu: MenuDTO = await this.menusRepository.findOne({ id, storeId });
    if (!menu)
      throw new NotFoundException(
        `등록되지 않은 메뉴입니다.( id: ${id}, storeId: ${storeId} )`,
      );
    return menu;
  }

  async getValidatedMenuById(id: number): Promise<MenuDTO> {
    const menu: MenuDTO = await this.menusRepository.findOne({ id });
    if (!menu)
      throw new NotFoundException(`등록되지 않은 메뉴입니다.( id: ${id} )`);
    return menu;
  }

  async findOneById(id: number): Promise<MenuDTO> {
    const menu: MenuDTO = await this.menusRepository.findOne({ id });
    return menu;
  }
}
