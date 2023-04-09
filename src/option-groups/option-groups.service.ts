import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, In, Repository } from 'typeorm';
import { MenuOptionGroupEntity } from '../common/entities/menu-opton-groups.entity';
import { OptionGroupEntity } from '../common/entities/option-groups.entity';
import { SortCreated } from '../common/enums/sort-created';
import { StoresService } from '../stores/stores.service';
import { OptionGroupDetailDTO } from './dtos/option-group-detail.dto';
import { OptionGroupEditDTO } from './dtos/option-group-edit.dto';
import { OptionGroupListDTO } from './dtos/option-group-list.dto';
import { OptionGroupPositionDTO } from './dtos/option-group-position.dto';
import { OptionGroupRegisterDTO } from './dtos/option-group-reg.dto';
import { OptionGroupDTO } from './dtos/option-group.dto';

@Injectable()
export class OptionGroupsService {
  private readonly logger = new Logger(OptionGroupsService.name);

  constructor(
    private readonly storesService: StoresService,
    @InjectRepository(MenuOptionGroupEntity)
    private readonly menuOptionGroupsRepository: Repository<MenuOptionGroupEntity>,
    @InjectRepository(OptionGroupEntity)
    private readonly optionGroupsRepository: Repository<OptionGroupEntity>,
  ) {}

  async findOptionGroupsByStoreId(
    storeId: number,
    sort: SortCreated,
  ): Promise<OptionGroupListDTO[]> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);

    const optionGroups: OptionGroupListDTO[] = await getRepository(
      OptionGroupEntity,
    )
      .createQueryBuilder('optionGroup')
      .select([
        'optionGroup.id',
        'optionGroup.createdAt',
        'optionGroup.name',
        'optionGroup.isRequired',
        'optionGroup.minOption',
        'optionGroup.maxOption',
        'optionGroup.optionCount',
        'optionGroup.position',
      ])
      .where('optionGroup.storeId = :ogsid', {
        ogsid: storeId,
      })
      .orderBy('optionGroup.createdAt', sort)
      .getMany();

    return optionGroups;
  }

  async findOptionGroupsIsRequired(
    storeId: number,
    isRequired: boolean,
    sort: SortCreated,
  ): Promise<OptionGroupListDTO[]> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);

    const optionGroups: OptionGroupListDTO[] = await getRepository(
      OptionGroupEntity,
    )
      .createQueryBuilder('optionGroup')
      .select([
        'optionGroup.id',
        'optionGroup.createdAt',
        'optionGroup.name',
        'optionGroup.isRequired',
        'optionGroup.minOption',
        'optionGroup.maxOption',
        'optionGroup.optionCount',
        'optionGroup.position',
      ])
      .where('optionGroup.storeId = :ogsid', {
        ogsid: storeId,
      })
      .andWhere('optionGroup.isRequired = :ogisRequired', {
        ogisRequired: isRequired,
      })
      .orderBy('optionGroup.createdAt', sort)
      .getMany();

    return optionGroups;
  }

  async registerOptionGroup(
    storeId: number,
    optionGroupRegisterDTO: OptionGroupRegisterDTO,
  ): Promise<number> {
    const { name, isRequired } = optionGroupRegisterDTO;
    let minOption = 0;
    const maxOption = 1;
    // 필수일 경우 최소선택수, 최대선택수는 1
    if (isRequired) {
      minOption = 1;
    }
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 옵션그룹명 중복체크
    await this.validateOptionGroupNameByStoreId(storeId, name);
    // 최대선택수의 경우는 옵션총개수이하인지 체크 ( 옵션그룹 등록시에는 체크 불가능 )
    // position 설정
    const optionGroupCount = await this.countOptionGroupByStoreId(storeId);
    const position = optionGroupCount + 1;

    const optionGroup = await this.optionGroupsRepository.save({
      storeId,
      name,
      isRequired,
      minOption,
      maxOption,
      position,
    });

    return optionGroup.id;
  }

  async findOptionGroupById(id: number): Promise<OptionGroupDetailDTO> {
    const optionGroup: OptionGroupDetailDTO = await getRepository(
      OptionGroupEntity,
    )
      .createQueryBuilder('optionGroup')
      .select([
        'optionGroup.id',
        'optionGroup.createdAt',
        'optionGroup.storeId',
        'optionGroup.name',
        'optionGroup.isRequired',
        'optionGroup.minOption',
        'optionGroup.maxOption',
        'optionGroup.optionCount',
        'optionGroup.position',
      ])
      .where('optionGroup.id = :mgid', {
        mgid: id,
      })
      .getOne();

    return optionGroup;
  }

  async updateOptionGroupById(
    id: number,
    storeId: number,
    originalOptionGroup: OptionGroupDTO,
    optionGroupEditDTO: OptionGroupEditDTO,
  ): Promise<void> {
    const { name, isRequired, maxOption, position } = optionGroupEditDTO;
    let minOption = 0;
    // 필수일 경우 최소선택수, 최대선택수는 1
    if (isRequired) {
      minOption = 1;
    } else {
      // 선택일 경우 최대선택수가 옵션총개수이하인지 체크
      // const optionCount: number = originalOptionGroup.optionCount;
      // if (maxOption > optionCount) {
      //   throw new BadRequestException(
      //     `선택일 경우 최대선택수는 해당 옵션그룹에 등록된 옵션 총개수이하입니다, maxOption: ${maxOption}, option count: ${optionCount}`,
      //   );
      // }
    }
    // 옵션그룹명 중복체크
    if (name !== originalOptionGroup.name) {
      await this.validateOptionGroupNameByStoreId(storeId, name);
    }

    await getConnection()
      .createQueryBuilder()
      .update(OptionGroupEntity)
      .set({
        name,
        isRequired,
        minOption,
        maxOption,
        position,
      })
      .where('option_group.id = :ogid', {
        ogid: id,
      })
      .execute();
  }

  async incrementOptionCountById(id: number): Promise<void> {
    await this.optionGroupsRepository.increment({ id }, 'optionCount', 1);
  }

  async decrementOptionCountById(id: number): Promise<void> {
    await this.optionGroupsRepository.decrement({ id }, 'optionCount', 1);
  }

  async updatePositionOptionGroupsById(
    storeId: number,
    optionGroupPositionDTO: OptionGroupPositionDTO,
  ): Promise<void> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 노출순서 옵션그룹 아이디 체크
    const { optionGroupIds } = optionGroupPositionDTO;
    const optionGroupCount = await this.countOptionGroupByStoreId(storeId);
    if (optionGroupIds.length !== optionGroupCount) {
      throw new BadRequestException(
        `옵션그룹 아이디의 갯수는 옵션그룹 리스트 수와 동일해야 합니다, list count: ${optionGroupCount}, optionGroupIds count: ${optionGroupIds.length}`,
      );
    }
    const optionGroups = await this.getOptionGroupsInIds(
      optionGroupIds,
      storeId,
    );
    for (let i = 0; i < optionGroupIds.length; i++) {
      const optionGroupId = optionGroupIds[i];
      let isExist = false;
      for (let j = 0; j < optionGroups.length; j++) {
        const optionGroup = optionGroups[j];
        if (optionGroupId === optionGroup.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        throw new NotFoundException(
          `해당 아이디의 옵션그룹은 존재하지 않습니다, storeId: ${storeId}, optionGroupId: ${optionGroupId}`,
        );
      }
    }
    // 노출순서 옵션그룹 아이디 업뎃
    for (let i = 0; i < optionGroupIds.length; i++) {
      const optionGroupId = optionGroupIds[i];
      await this.optionGroupsRepository.update(
        { id: optionGroupId },
        { position: i + 1 },
      );
    }
  }

  async deleteOptionGroupById(id: number): Promise<void> {
    // 옵션그룹과 연동된 메뉴옵션그룹( menuOptionGroup )이 없는 경우만 옵션그룹 삭제 가능
    const menuOptionGroups = await this.menuOptionGroupsRepository.find({
      optionGroupId: id,
    });
    if (menuOptionGroups.length > 0) {
      const menuIds: number[] = menuOptionGroups.map((item) => {
        return item.menuId;
      });
      throw new BadRequestException(
        `연결된 메뉴가 없는 옵션그룹만 삭제 가능합니다. 연결된 menuId list: ${menuIds}`,
      );
    }

    await getConnection()
      .createQueryBuilder()
      .softDelete()
      .from(OptionGroupEntity)
      .where('option_group.id = :ogid', {
        ogid: id,
      })
      .execute();
  }

  async getOptionGroupsInIds(
    ids: number[],
    storeId: number,
  ): Promise<OptionGroupDTO[]> {
    const optionGroups: OptionGroupDTO[] =
      await this.optionGroupsRepository.find({
        id: In(ids),
        storeId,
      });
    return optionGroups;
  }

  async countOptionGroupByStoreId(storeId: number): Promise<number> {
    return await this.optionGroupsRepository.count({ storeId });
  }

  async validateOptionGroupNameByStoreId(
    storeId: number,
    name: string,
  ): Promise<void> {
    const optionGroup = await this.optionGroupsRepository.findOne({
      storeId,
      name,
    });
    if (optionGroup)
      throw new ConflictException(
        `이미 생성된 옵션그룹명입니다.( storeId: ${storeId}, name: ${name} )`,
      );
  }

  async validateOptionGroupIsRequired(
    id: number,
    storeId: number,
    isRequired: boolean,
  ): Promise<OptionGroupDTO> {
    const optionGroup: OptionGroupDTO =
      await this.optionGroupsRepository.findOne({
        id,
        storeId,
        isRequired,
      });
    if (!optionGroup) {
      throw new NotFoundException(
        `등록되지 않은 옵션그룹입니다.( id: ${id}, storeId: ${storeId} )`,
      );
    }
    return optionGroup;
  }

  async getValidatedOptionGroupByIds(
    id: number,
    storeId: number,
  ): Promise<OptionGroupDTO> {
    const optionGroup: OptionGroupDTO =
      await this.optionGroupsRepository.findOne({
        id,
        storeId,
      });
    if (!optionGroup) {
      throw new NotFoundException(
        `등록되지 않은 옵션그룹입니다.( id: ${id}, storeId: ${storeId} )`,
      );
    }
    return optionGroup;
  }

  async getValidatedOptionGroupById(id: number): Promise<OptionGroupDTO> {
    const optionGroup: OptionGroupDTO =
      await this.optionGroupsRepository.findOne({ id });
    if (!optionGroup) {
      throw new NotFoundException(`등록되지 않은 옵션그룹입니다.( id: ${id} )`);
    }
    return optionGroup;
  }

  async findOneById(id: number): Promise<any> {
    return await this.optionGroupsRepository.findOne({ id });
  }
}
