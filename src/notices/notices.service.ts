import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { NoticeEntity } from '../common/entities/notices.entity';
import { NoticeFormDTO } from './dtos/notice-form.dto';
import { NoticeSearchDTO } from './dtos/notice-search.dto';
import { NoticeDTO } from './dtos/notice.dto';

@Injectable()
export class NoticesService {
  private readonly logger = new Logger(NoticesService.name);

  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticesRepository: Repository<NoticeEntity>,
  ) {}

  async getNoticeList(
    noticeSearchDTO: NoticeSearchDTO,
  ): Promise<Pagination<NoticeEntity, IPaginationMeta>> {
    const queryBuilder = this.noticesRepository.createQueryBuilder('n');
    queryBuilder.select([
      'n.id',
      'n.createdAt',
      'n.title',
      'n.imageUrl',
      'n.hitCount',
      'o.fullName',
    ]);
    queryBuilder.leftJoin('n.owner', 'o');
    const { type, keyword } = noticeSearchDTO;
    // 타입(고객, 점주) 설정
    queryBuilder.where('n.type = :type', { type });
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('n.title like :title', {
        title: '%' + keyword + '%',
      });
      queryBuilder.orWhere('n.body like :title', {
        body: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('n.createdAt', 'DESC');

    const noticeList = paginate<NoticeEntity>(
      queryBuilder,
      noticeSearchDTO.getIPaginationOptions(),
    );
    return noticeList;
  }

  async registerNotice(
    ownerId: number,
    noticeFormDTO: NoticeFormDTO,
  ): Promise<void> {
    const { title, body, imageUrl, type } = noticeFormDTO;
    // 공지사항 등록
    await this.noticesRepository.save({
      title,
      body,
      imageUrl,
      ownerId,
      type,
    });
  }

  async getNoticeById(id: number): Promise<any> {
    // 공지사항 상세
    const noticeDetail = await this.noticesRepository
      .createQueryBuilder('n')
      .select([
        'n.id',
        'n.createdAt',
        'n.title',
        'n.body',
        'n.imageUrl',
        'n.hitCount',
        'n.type',
        'o.fullName',
      ])
      .leftJoin('n.owner', 'o')
      .where('n.id = :id', { id })
      .getOne();

    return noticeDetail;
  }

  async updateNoticeById(
    id: number,
    ownerId: number,
    noticeFormDTO: NoticeFormDTO,
  ): Promise<void> {
    const { title, body, imageUrl, type } = noticeFormDTO;
    // 공지사항 수정
    await this.noticesRepository.update(id, {
      title,
      body,
      imageUrl,
      ownerId,
      type,
    });
  }

  async deleteNoticeById(id: number, ownerId: number): Promise<void> {
    // 삭제자 아이디 업데이트
    await this.noticesRepository.update(id, {
      ownerId,
    });
    // 공지사항 삭제
    await this.noticesRepository.softDelete(id);
  }

  async getValidatedNoticeById(id: number): Promise<NoticeDTO> {
    const notice: NoticeDTO = await this.noticesRepository.findOne({
      id,
    });
    if (!notice) {
      throw new NotFoundException(`등록되지 않은 공지사항입니다.( id: ${id} )`);
    }

    return notice;
  }
}
