import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Not, Repository } from 'typeorm';
import { AreaCategory } from '../common/enums/area-category';
import { RecommendCategoryEntity } from '../common/entities/recommend-categories.entity';
import { RecommendCategoryAreaEntity } from '../common/entities/recommend-category-areas.entity';
import { StoreEntity } from '../common/entities/stores.entity';
import { RecommendCategoryAreaFormDTO } from './dtos/recommend-category-area-form.dto';
import { RecommendCategoryListDTO } from './dtos/recommend-category-list.dto';
import { RecommendCategoryFormDTO } from './dtos/recommend-category-form.dto';
import { RecommendCategoryDTO } from './dtos/recommend-category.dto';

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(
    @InjectRepository(RecommendCategoryEntity)
    private readonly recommendCategoriesRepository: Repository<RecommendCategoryEntity>,
    @InjectRepository(RecommendCategoryAreaEntity)
    private readonly recommendCategoryAreasRepository: Repository<RecommendCategoryAreaEntity>,
    @InjectRepository(StoreEntity)
    private readonly storesRepository: Repository<StoreEntity>,
  ) {}

  async findRecommendCategories(): Promise<RecommendCategoryListDTO[]> {
    const recommendCategories: RecommendCategoryListDTO[] = await getRepository(
      RecommendCategoryEntity,
    )
      .createQueryBuilder('recommendCategory')
      .select([
        'recommendCategory.id',
        'recommendCategory.name',
        'recommendCategory.menuKeyword1',
        'recommendCategory.menuKeyword2',
        'recommendCategory.menuKeyword3',
        'recommendCategory.startedAt',
        'recommendCategory.endedAt',
        'recommendCategory.isDisplayed',
      ])
      .orderBy('recommendCategory.createdAt', 'DESC')
      .getMany();

    return recommendCategories;
  }

  async registerRecommendCategory(
    recommendCategoryFormDTO: RecommendCategoryFormDTO,
  ): Promise<void> {
    const {
      name,
      menuKeyword1,
      menuKeyword2,
      menuKeyword3,
      startedAt,
      endedAt,
      isAllAreas,
      isDisplayed,
    } = recommendCategoryFormDTO;
    const recommendCategoryAreas: RecommendCategoryAreaFormDTO[] =
      recommendCategoryFormDTO.recommendCategoryAreas;
    // 추천카테고리명(추천주제) 체크
    await this.validateRecommendCategoryName(name);
    // 추천카테고리(오늘의추천) 갯수
    const recommendCategoryCount = await this.countRecommendCategory();
    // 노출순서
    const position = recommendCategoryCount + 1;
    // 추천카테고리(오늘의추천) 저장
    const recommendCategory = await this.recommendCategoriesRepository.save({
      name,
      menuKeyword1,
      menuKeyword2,
      menuKeyword3,
      startedAt,
      endedAt,
      isAllAreas,
      isDisplayed,
      position,
    });
    // 노출지역 전체가 아닐 경우
    if (!isAllAreas) {
      // 추천카테고리 아이디
      const recommendCategoryId = recommendCategory.id;
      // 지역구분은 17개 시도 대분류
      const category = AreaCategory.Large;
      for (let i = 0; i < recommendCategoryAreas.length; i++) {
        const recommendCategoryArea = recommendCategoryAreas[i];
        // 추천카테고리지역 저장
        await this.recommendCategoryAreasRepository.save({
          recommendCategoryId,
          category,
          name: recommendCategoryArea.name,
        });
      }
    }
  }

  async findRecommendCategoryById(id: number): Promise<any> {
    // 추천카테고리 아이디 체크
    await this.getValidatedRecommendCategoryById(id);
    const recommendCategory = await getRepository(RecommendCategoryEntity)
      .createQueryBuilder('recommendCategory')
      .select([
        'recommendCategory.id',
        'recommendCategory.createdAt',
        'recommendCategory.name',
        'recommendCategory.menuKeyword1',
        'recommendCategory.menuKeyword2',
        'recommendCategory.menuKeyword3',
        'recommendCategory.startedAt',
        'recommendCategory.endedAt',
        'recommendCategory.isAllAreas',
        'recommendCategory.isDisplayed',
        'recommendCategoryArea.name',
      ])
      .leftJoin(
        'recommendCategory.recommendCategoryAreas',
        'recommendCategoryArea',
      )
      .where('recommendCategory.id = :rcid', {
        rcid: id,
      })
      .getOne();

    return recommendCategory;
  }

  async updateRecommendCategoryById(
    id: number,
    recommendCategoryFormDTO: RecommendCategoryFormDTO,
  ): Promise<void> {
    const {
      name,
      menuKeyword1,
      menuKeyword2,
      menuKeyword3,
      startedAt,
      endedAt,
      isAllAreas,
      isDisplayed,
    } = recommendCategoryFormDTO;
    const recommendCategoryAreas: RecommendCategoryAreaFormDTO[] =
      recommendCategoryFormDTO.recommendCategoryAreas;
    // 추천카테고리 아이디 체크
    const originalRecommendCategory =
      await this.getValidatedRecommendCategoryById(id);
    // 기존 추천카테고리명(추천주제)이 변경되었을 경우
    if (name !== originalRecommendCategory.name) {
      // 추천카테고리명(추천주제) 체크
      await this.validateRecommendCategoryName(name);
    }
    // 추천카테고리(오늘의추천) 수정
    await this.recommendCategoriesRepository.update(id, {
      name,
      menuKeyword1,
      menuKeyword2,
      menuKeyword3,
      startedAt,
      endedAt,
      isAllAreas,
      isDisplayed,
    });
    // 추천카테고리지역 삭제
    await this.recommendCategoryAreasRepository.softDelete({
      recommendCategoryId: id,
    });
    // 노출지역 전체가 아닐 경우
    if (!isAllAreas) {
      // 지역구분은 17개 시도 대분류
      const category = AreaCategory.Large;
      for (let i = 0; i < recommendCategoryAreas.length; i++) {
        const recommendCategoryArea = recommendCategoryAreas[i];
        // 추천카테고리지역 저장
        await this.recommendCategoryAreasRepository.save({
          recommendCategoryId: id,
          category,
          name: recommendCategoryArea.name,
        });
      }
    }
  }

  async deleteRecommendCategoryById(id: number): Promise<void> {
    // 추천카테고리 아이디 체크
    await this.getValidatedRecommendCategoryById(id);
    // 추천카테고리지역 삭제
    await this.recommendCategoryAreasRepository.softDelete({
      recommendCategoryId: id,
    });
    // 추천카테고리 삭제
    await this.recommendCategoriesRepository.softDelete({ id });
  }

  async countRecommendCategory(): Promise<number> {
    return await this.recommendCategoriesRepository.count();
  }

  async validateRecommendCategoryName(name: string): Promise<void> {
    const recommendCategory = await this.recommendCategoriesRepository.findOne({
      name,
    });
    if (recommendCategory)
      throw new ConflictException(
        `이미 생성된 추천주제입니다.( name: ${name} )`,
      );
  }

  async getValidatedRecommendCategoryById(
    id: number,
  ): Promise<RecommendCategoryDTO> {
    const recommendCategory: RecommendCategoryDTO =
      await this.recommendCategoriesRepository.findOne({
        id,
      });
    if (!recommendCategory) {
      throw new NotFoundException(
        `등록되지 않은 오늘의추천입니다.( id: ${id} )`,
      );
    }

    return recommendCategory;
  }
}
