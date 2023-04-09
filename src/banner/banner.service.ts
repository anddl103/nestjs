import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from 'src/common/entities/banner.entity';
import { OwnerDTO } from 'src/owners/dtos/owner.dto';
import { BannerRegisterDTO } from './dtos/banner-res.dto';
import { BannerSearchDTO } from './dtos/banner-search.dto';
import { Repository } from 'typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { BannerEditDTO } from './dtos/banner-edit.dto';

type NewType = Pagination<BannerEntity, IPaginationMeta>;

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannersRepository: Repository<BannerEntity>,
  ) {}

  async getBannerList(bannerSearchDTO: BannerSearchDTO): Promise<NewType> {
    const queryBuilder = this.bannersRepository.createQueryBuilder('b');
    queryBuilder.select([
      'b.id',
      'b.name',
      'b.startedAt',
      'b.endedAt',
      'b.type',
      'b.isDisabled',
      'b.url',
      'b.link',
      'b.description',
      'b.createdAt',
    ]);
    const { type, keyword } = bannerSearchDTO;
    // 타입(고객, 점주) 설정
    if (type) {
      queryBuilder.where('b.type = :type', { type });
    }

    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('b.name like :name', {
        name: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('b.createdAt', 'DESC');

    const bannerList = paginate<BannerEntity>(
      queryBuilder,
      bannerSearchDTO.getIPaginationOptions(),
    );
    return bannerList;
  }

  async getBannerById(id: number): Promise<any> {
    // 문의 상세
    const bannerDetail = await this.bannersRepository
      .createQueryBuilder('b')
      .select([
        'b.id',
        'b.name',
        'b.startedAt',
        'b.endedAt',
        'b.type',
        'b.isDisabled',
        'b.url',
        'b.link',
        'b.description',
        'b.createdAt',
        'b.updatedAt',
      ])
      .where('b.id = :id', { id })
      .getOne();

    return bannerDetail;
  }

  async registerBanner(
    bannerRegisterDTO: BannerRegisterDTO,
    currentOwner: OwnerDTO,
  ): Promise<void> {
    const ownerId = currentOwner.id;
    const {
      name,
      type,
      startedAt,
      endedAt,
      isDisabled,
      description,
      url,
      link,
    } = bannerRegisterDTO;

    try {
      // 배너 등록
      await this.bannersRepository.save({
        name,
        startedAt,
        endedAt,
        type,
        isDisabled,
        description,
        url,
        link,
        createdBy: ownerId,
      });
    } catch (error) {
      throw new BadRequestException('배너 등록 실패');
    }
  }

  async updateBannerById(
    id: number,
    bannerEditDTO: BannerEditDTO,
    currentOwner: OwnerDTO,
  ): Promise<void> {
    const ownerId = currentOwner.id;
    const {
      name,
      type,
      startedAt,
      endedAt,
      isDisabled,
      description,
      url,
      link,
    } = bannerEditDTO;

    try {
      // 배너 수정
      await this.bannersRepository.update(id, {
        name,
        type,
        startedAt,
        endedAt,
        isDisabled,
        description,
        url,
        link,
        updatedAt: ownerId,
      });
    } catch (error) {
      throw new BadRequestException('배너 수정 실패');
    }
  }

  async deleteBannerById(id: number): Promise<void> {
    // 배너 삭제
    await this.bannersRepository.softDelete(id);
  }
}
