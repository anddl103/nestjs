import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, In, Repository } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { MenuGroupEntity } from '../common/entities/menu-groups.entity';
import { MenuEntity } from '../common/entities/menus.entity';
import { MenuGroupDTO } from './dtos/menu-group.dto';
import { MenuGroupPositionDTO } from './dtos/menu-group-position.dto';
import { MenuGroupListDTO } from './dtos/menu-group-list.dto';
import { MenuGroupDetailDTO } from './dtos/menu-group-detail.dto';
import { MenuGroupEditDTO } from './dtos/menu-group-edit.dto';

@Injectable()
export class MenuGroupsService {
  private readonly logger = new Logger(MenuGroupsService.name);

  constructor(
    private readonly storesService: StoresService,
    @InjectRepository(MenuGroupEntity)
    private readonly menuGroupsRepository: Repository<MenuGroupEntity>,
    @InjectRepository(MenuEntity)
    private readonly menusRepository: Repository<MenuEntity>,
  ) {}

  async findMenuGroupsByStoreId(storeId: number): Promise<MenuGroupListDTO[]> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);

    const menuGroups: MenuGroupListDTO[] = await getRepository(MenuGroupEntity)
      .createQueryBuilder('menuGroup')
      .select([
        'menuGroup.id',
        'menuGroup.createdAt',
        'menuGroup.name',
        'menuGroup.type',
        'menuGroup.menuCount',
        'menuGroup.position',
      ])
      .where('menuGroup.storeId = :mgsid', {
        mgsid: storeId,
      })
      .orderBy('menuGroup.createdAt', 'DESC')
      .getMany();

    return menuGroups;
  }

  async registerMenuGroup(
    storeId: number,
    name: string,
    type: string,
  ): Promise<void> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 메뉴그룹명 중복체크
    await this.validateMenuGroupNameByStoreId(storeId, name);
    // position 설정
    const menuGroupCount = await this.countMenuGroupByStoreId(storeId);
    const position = menuGroupCount + 1;

    await this.menuGroupsRepository.save({ storeId, name, type, position });
  }

  async findMenuGroupById(id: number): Promise<MenuGroupDetailDTO> {
    const menuGroup: MenuGroupDetailDTO = await getRepository(MenuGroupEntity)
      .createQueryBuilder('menuGroup')
      .select([
        'menuGroup.id',
        'menuGroup.createdAt',
        'menuGroup.storeId',
        'menuGroup.name',
        'menuGroup.type',
        'menuGroup.position',
      ])
      .where('menuGroup.id = :mgid', {
        mgid: id,
      })
      .getOne();

    return menuGroup;
  }

  async updateMenuGroupById(
    id: number,
    storeId: number,
    originalMenuGroup: MenuGroupDTO,
    menuGroupEditDTO: MenuGroupEditDTO,
  ): Promise<void> {
    const { name, type, position } = menuGroupEditDTO;
    // 기존메뉴그룹명이 변경되었을 경우
    if (name !== originalMenuGroup.name) {
      // 메뉴그룹명 중복체크
      await this.validateMenuGroupNameByStoreId(storeId, name);
    }

    await getConnection()
      .createQueryBuilder()
      .update(MenuGroupEntity)
      .set({
        name,
        type,
        position,
      })
      .where('menu_group.id = :mgid', {
        mgid: id,
      })
      .execute();
  }

  async incrementMenuCountById(id: number): Promise<void> {
    await this.menuGroupsRepository.increment({ id }, 'menuCount', 1);
  }

  async decrementMenuCountById(id: number): Promise<void> {
    await this.menuGroupsRepository.decrement({ id }, 'menuCount', 1);
  }

  async updatePositionMenuGroupsById(
    storeId: number,
    menuGroupPositionDTO: MenuGroupPositionDTO,
  ): Promise<void> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 노출순서 메뉴그룹 아이디 체크
    const { menuGroupIds } = menuGroupPositionDTO;
    const menuGroupCount = await this.countMenuGroupByStoreId(storeId);
    if (menuGroupIds.length !== menuGroupCount) {
      throw new BadRequestException(
        `메뉴그룹 아이디의 갯수는 메뉴그룹 리스트 수와 동일해야 합니다, list count: ${menuGroupCount}, menuGroupIds count: ${menuGroupIds.length}`,
      );
    }
    const menuGroups = await this.getMenuGroupsInIds(menuGroupIds, storeId);
    for (let i = 0; i < menuGroupIds.length; i++) {
      const menuGroupId = menuGroupIds[i];
      let isExist = false;
      for (let j = 0; j < menuGroups.length; j++) {
        const menuGroup = menuGroups[j];
        if (menuGroupId === menuGroup.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        throw new NotFoundException(
          `해당 아이디의 메뉴그룹은 존재하지 않습니다, storeId: ${storeId}, menuGroupId: ${menuGroupId}`,
        );
      }
    }
    // 노출순서 메뉴그룹 아이디 업뎃
    for (let i = 0; i < menuGroupIds.length; i++) {
      const menuGroupId = menuGroupIds[i];
      await this.menuGroupsRepository.update(
        { id: menuGroupId },
        { position: i + 1 },
      );
    }
  }

  async deleteMenuGroupById(id: number): Promise<void> {
    // menu 가 없을 경우만 menuGroup 삭제 가능
    const menuCount = await this.menusRepository.count({ menuGroupId: id });
    if (menuCount > 0)
      throw new BadRequestException(
        `메뉴가 있는 메뉴그룹입니다.( id: ${id}, menuCount: ${menuCount} )`,
      );

    await getConnection()
      .createQueryBuilder()
      .softDelete()
      .from(MenuGroupEntity)
      .where('menu_group.id = :mgid', {
        mgid: id,
      })
      .execute();
  }

  async getMenuGroupsInIds(
    ids: number[],
    storeId: number,
  ): Promise<MenuGroupDTO[]> {
    const menuGroups: MenuGroupDTO[] = await this.menuGroupsRepository.find({
      id: In(ids),
      storeId,
    });
    return menuGroups;
  }

  async getMenuGroupNameById(id: number): Promise<string> {
    const menuGroup = await getRepository(MenuGroupEntity)
      .createQueryBuilder('menuGroup')
      .select(['menuGroup.name'])
      .where('menuGroup.id = :mgid', {
        mgid: id,
      })
      .getOne();

    if (!menuGroup)
      throw new NotFoundException(`등록되지 않은 메뉴그룹입니다.( id: ${id} )`);

    return menuGroup.name;
  }

  async countMenuGroupByStoreId(storeId: number): Promise<number> {
    return await this.menuGroupsRepository.count({ storeId });
  }

  async validateMenuGroupNameByStoreId(
    storeId: number,
    name: string,
  ): Promise<void> {
    const menuGroup = await this.menuGroupsRepository.findOne({
      storeId,
      name,
    });
    if (menuGroup)
      throw new ConflictException(
        `이미 생성된 메뉴그룹명입니다.( storeId: ${storeId}, name: ${name} )`,
      );
  }

  async getValidatedMenuGroupByIds(
    id: number,
    storeId: number,
  ): Promise<MenuGroupDTO> {
    const menuGroup: MenuGroupDTO = await this.menuGroupsRepository.findOne({
      id,
      storeId,
    });
    if (!menuGroup)
      throw new NotFoundException(
        `등록되지 않은 메뉴그룹입니다.( id: ${id}, storeId: ${storeId} )`,
      );

    return menuGroup;
  }

  async getValidatedMenuGroupById(id: number): Promise<MenuGroupDTO> {
    const menuGroup: MenuGroupDTO = await this.menuGroupsRepository.findOne({
      id,
    });
    if (!menuGroup)
      throw new NotFoundException(`등록되지 않은 메뉴그룹입니다.( id: ${id} )`);

    return menuGroup;
  }

  async findOneById(id: number): Promise<any> {
    return await this.menuGroupsRepository.findOne({ id });
  }
}
