import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, In, Repository } from 'typeorm';
import { CategoryEntity } from '../common/entities/categories.entity';
import { CategoryDetailDTO } from './dtos/category-detail.dto';
import { CategoryFormDTO } from './dtos/category-form.dto';
import { CategoryListDTO } from './dtos/category-list.dto';
import { CategoryDTO } from './dtos/category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(): Promise<CategoryListDTO[]> {
    const categories: CategoryListDTO[] = await getRepository(CategoryEntity)
      .createQueryBuilder('category')
      .select(['category.id', 'category.name'])
      .orderBy('category.createdAt', 'ASC')
      .getMany();

    return categories;
  }

  async registerCategory(categoryFormDTO: CategoryFormDTO): Promise<void> {
    const { name } = categoryFormDTO;
    // 카테고리명 중복체크
    await this.validateCategoryName(name);
    // 카테고리 등록
    await this.categoriesRepository.save({
      name,
    });
  }

  async getCategoryById(id: number): Promise<CategoryDetailDTO> {
    // 카테고리 상세
    const categoryDetail: CategoryDetailDTO = await this.categoriesRepository
      .createQueryBuilder('c')
      .select(['c.id', 'c.createdAt', 'c.name'])
      .where('c.id = :id', { id })
      .getOne();

    return categoryDetail;
  }

  async updateCategoryById(
    id: number,
    originalCategory: CategoryDTO,
    categoryFormDTO: CategoryFormDTO,
  ): Promise<void> {
    const { name } = categoryFormDTO;
    // 카테고리명 중복체크
    if (name !== originalCategory.name) {
      await this.validateCategoryName(name);
    }
    // 카테고리 수정
    await this.categoriesRepository.update(id, {
      name,
    });
  }

  async deleteCategoryById(id: number): Promise<void> {
    // 카테고리 삭제
    await this.categoriesRepository.softDelete(id);
  }

  async validateCategoryInIds(ids: number[]): Promise<void> {
    const categories = await this.categoriesRepository.find({
      id: In(ids),
    });
    if (ids.length !== categories.length) {
      throw new BadRequestException(
        `카테고리 아이디 리스트에 잘못된 id가 있습니다.`,
      );
    }
  }

  async validateCategoryName(name: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      name,
    });
    if (category)
      throw new ConflictException(
        `이미 생성된 카테고리명입니다.( name: ${name} )`,
      );
  }

  async getValidatedCategoryById(id: number): Promise<CategoryDTO> {
    const category: CategoryDTO = await this.categoriesRepository.findOne({
      id,
    });
    if (!category) {
      throw new NotFoundException(`등록되지 않은 카테고리입니다.( id: ${id} )`);
    }

    return category;
  }
}
