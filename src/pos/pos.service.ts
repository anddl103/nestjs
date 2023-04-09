import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosBannerEntity } from '../common/entities/pos-banners.entity';
import { PosBannerDetailDTO } from './dtos/pos-banner-detail.dto';
import { PosBannerFormDTO } from './dtos/pos-banner-form.dto';

@Injectable()
export class PosService {
  private readonly logger = new Logger(PosService.name);

  constructor(
    @InjectRepository(PosBannerEntity)
    private readonly posBannersRepository: Repository<PosBannerEntity>,
  ) {}

  async registerPosBanner(
    ownerId: number,
    posBannerFormDTO: PosBannerFormDTO,
  ): Promise<void> {
    const { bannerUrl, href } = posBannerFormDTO;
    // POS 배너 등록
    await this.posBannersRepository.save({
      ownerId,
      bannerUrl,
      href,
    });
  }

  async getPosBanner(): Promise<PosBannerDetailDTO> {
    return await this.getValidatedPosBanner();
  }

  async updatePosBanner(
    ownerId: number,
    posbannerFormDTO: PosBannerFormDTO,
  ): Promise<void> {
    const { bannerUrl, href } = posbannerFormDTO;
    // POS 배너 체크 및 가져오기
    const posBanner = await this.getValidatedPosBanner();
    const id = posBanner.id;
    // POS 배너 수정
    await this.posBannersRepository.update(id, {
      ownerId,
      bannerUrl,
      href,
    });
  }

  async getValidatedPosBanner(): Promise<PosBannerDetailDTO> {
    const posbanner: PosBannerDetailDTO = await this.posBannersRepository
      .createQueryBuilder('pb')
      .select(['pb.id', 'pb.bannerUrl', 'pb.href'])
      .limit(1)
      .getOne();
    if (!posbanner) {
      throw new NotFoundException(`등록되지 않은 POS 배너입니다.`);
    }

    return posbanner;
  }
}
