import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { EventEntity } from '../common/entities/events.entity';
import { EventFormDTO } from './dtos/event-form.dto';
import { EventSearchDTO } from './dtos/event-search.dto';
import { EventDTO } from './dtos/event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
  ) {}

  async getEventList(
    eventSearchDTO: EventSearchDTO,
  ): Promise<Pagination<EventEntity, IPaginationMeta>> {
    const queryBuilder = this.eventsRepository.createQueryBuilder('e');
    queryBuilder.select([
      'e.id',
      'e.createdAt',
      'e.startedAt',
      'e.endedAt',
      'e.title',
      'e.bannerUrl',
      'e.hitCount',
      'o.fullName',
    ]);
    queryBuilder.leftJoin('e.owner', 'o');
    // 표시여부 체크
    queryBuilder.where('e.isDisplayed = true');
    // 검색 조건
    const keyword = eventSearchDTO.keyword;
    if (keyword) {
      queryBuilder.andWhere('e.title like :title', {
        title: '%' + keyword + '%',
      });
      queryBuilder.orWhere('e.body like :title', {
        body: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('e.createdAt', 'DESC');

    const eventList = paginate<EventEntity>(
      queryBuilder,
      eventSearchDTO.getIPaginationOptions(),
    );
    return eventList;
  }

  async registerEvent(
    ownerId: number,
    eventFormDTO: EventFormDTO,
  ): Promise<void> {
    const { title, body, bannerUrl, imageUrl, startedAt, endedAt } =
      eventFormDTO;
    // 이벤트 등록
    await this.eventsRepository.save({
      title,
      body,
      bannerUrl,
      imageUrl,
      ownerId,
      startedAt,
      endedAt,
    });
  }

  async getEventById(id: number): Promise<any> {
    // 이벤트 상세
    const eventDetail = await this.eventsRepository
      .createQueryBuilder('e')
      .select([
        'e.id',
        'e.createdAt',
        'e.startedAt',
        'e.endedAt',
        'e.title',
        'e.body',
        'e.bannerUrl',
        'e.imageUrl',
        'e.hitCount',
        'o.fullName',
      ])
      .leftJoin('e.owner', 'o')
      .where('e.id = :eid', {
        eid: id,
      })
      .getOne();

    return eventDetail;
  }

  async updateEventById(
    id: number,
    ownerId: number,
    eventFormDTO: EventFormDTO,
  ): Promise<void> {
    const { title, body, bannerUrl, imageUrl, startedAt, endedAt } =
      eventFormDTO;
    // 이벤트 수정
    await this.eventsRepository.update(id, {
      title,
      body,
      bannerUrl,
      imageUrl,
      ownerId,
      startedAt,
      endedAt,
    });
  }

  async deleteEventById(id: number, ownerId: number): Promise<void> {
    // 삭제자 아이디 업데이트
    await this.eventsRepository.update(id, {
      ownerId,
    });
    // 이벤트 삭제
    await this.eventsRepository.softDelete(id);
  }

  async getValidatedEventById(id: number): Promise<EventDTO> {
    const event: EventDTO = await this.eventsRepository.findOne({
      id,
    });
    if (!event) {
      throw new NotFoundException(`등록되지 않은 이벤트입니다.( id: ${id} )`);
    }

    return event;
  }
}
