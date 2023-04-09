import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, In, Not, Repository } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { OptionGroupsService } from '../option-groups/option-groups.service';
import { OptionEntity } from '../common/entities/options.entity';
import { OptionListDTO } from './dtos/option-list.dto';
import { OptionRegisterDTO } from './dtos/option-reg.dto';
import { OptionDTO } from './dtos/option.dto';
import { OptionDetailDTO } from './dtos/option-detail.dto';
import { OptionEditDTO } from './dtos/option-edit.dto';

@Injectable()
export class OptionsService {
  private readonly logger = new Logger(OptionsService.name);

  constructor(
    private readonly storesService: StoresService,
    private readonly optionGroupsService: OptionGroupsService,
    @InjectRepository(OptionEntity)
    private readonly optionsRepository: Repository<OptionEntity>,
  ) {}

  async findOptionsByStoreId(
    storeId: number,
    optionGroupId: number,
  ): Promise<OptionListDTO[]> {
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 옵션그룹 아이디 체크
    await this.optionGroupsService.getValidatedOptionGroupByIds(
      optionGroupId,
      storeId,
    );

    const options: OptionListDTO[] = await getRepository(OptionEntity)
      .createQueryBuilder('option')
      .select([
        'option.id',
        'option.createdAt',
        'option.name',
        'option.price',
        'option.isSoldout',
        'option.position',
      ])
      .where('option.storeId = :osid', {
        osid: storeId,
      })
      .andWhere('option.optionGroupId = :oogid', {
        oogid: optionGroupId,
      })
      .orderBy('option.createdAt', 'DESC')
      .getMany();

    return options;
  }

  async registerOption(
    storeId: number,
    optionRegisterDTO: OptionRegisterDTO,
  ): Promise<void> {
    const { optionGroupId, name, price, isSoldout } = optionRegisterDTO;
    // 가게 아이디 체크
    await this.storesService.validateStore(storeId);
    // 옵션그룹 아이디 체크
    await this.optionGroupsService.getValidatedOptionGroupByIds(
      optionGroupId,
      storeId,
    );
    // position 설정
    const optionCount = await this.countOptionByIds(storeId, optionGroupId);
    const position = optionCount + 1;

    await this.optionsRepository.save({
      storeId,
      optionGroupId,
      name,
      price,
      isSoldout,
      position,
    });

    // 옵션그룹 > 옵션수 증가
    await this.optionGroupsService.incrementOptionCountById(optionGroupId);
  }

  async findOptionById(id: number): Promise<OptionDetailDTO> {
    const option: OptionDetailDTO = await getRepository(OptionEntity)
      .createQueryBuilder('option')
      .select([
        'option.id',
        'option.createdAt',
        'option.storeId',
        'option.optionGroupId',
        'option.name',
        'option.price',
        'option.isSoldout',
        'option.position',
      ])
      .where('option.id = :mgid', {
        mgid: id,
      })
      .getOne();

    return option;
  }

  async updateOptionById(
    id: number,
    optionEditDTO: OptionEditDTO,
  ): Promise<void> {
    const { name, price, isSoldout } = optionEditDTO;
    // 옵션 수정
    await getConnection()
      .createQueryBuilder()
      .update(OptionEntity)
      .set({
        name,
        price,
        isSoldout,
      })
      .where('option.id = :oid', {
        oid: id,
      })
      .execute();
  }

  async deleteOptionById(id: number, optionGroupId: number): Promise<void> {
    // 옵션 삭제
    await getConnection()
      .createQueryBuilder()
      .softDelete()
      .from(OptionEntity)
      .where('option.id = :oid', {
        oid: id,
      })
      .execute();
    // 옵션그룹 > 옵션수 감소
    await this.optionGroupsService.decrementOptionCountById(optionGroupId);
  }

  async getOptionsInIds(ids: number[], storeId: number): Promise<OptionDTO[]> {
    const options: OptionDTO[] = await this.optionsRepository.find({
      id: In(ids),
      storeId,
    });
    return options;
  }

  async countOptionByOptionGroupId(optionGroupId: number): Promise<number> {
    return await this.optionsRepository.count({ optionGroupId });
  }

  async countOptionByIds(
    storeId: number,
    optionGroupId: number,
  ): Promise<number> {
    return await this.optionsRepository.count({ storeId, optionGroupId });
  }

  async getValidatedOptionByIds(
    id: number,
    storeId: number,
  ): Promise<OptionDTO> {
    const option: OptionDTO = await this.optionsRepository.findOne({
      id,
      storeId,
    });
    if (!option)
      throw new NotFoundException(
        `등록되지 않은 옵션입니다.( id: ${id}, storeId: ${storeId} )`,
      );
    return option;
  }

  async getValidatedOptionById(id: number): Promise<OptionDTO> {
    const option: OptionDTO = await this.optionsRepository.findOne({ id });
    if (!option)
      throw new NotFoundException(`등록되지 않은 옵션입니다.( id: ${id} )`);
    return option;
  }

  async findOneById(id: number): Promise<OptionDTO> {
    const option: OptionDTO = await this.optionsRepository.findOne({ id });
    return option;
  }
}
