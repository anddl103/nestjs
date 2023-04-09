import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationMeta,
  paginate,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { PaymentSnapshotsService } from '../payment-snapshots/payment-snapshots.service';
import { StoresService } from '../stores/stores.service';
import { OwnersService } from '../owners/owners.service';
import { SettlementEntity } from '../common/entities/settlements.entity';
import { SettlementFeeEntity } from '../common/entities/settlement-fees.entity';
import { SettlementSumEntity } from '../common/entities/settlement-sums.entity';
import { SettlementSumSnapshotEntity } from '../common/entities/settlement-sum-snapshots.entity';
import { CouponIssuer } from '../common/enums/coupon-issuer';
import { OrderStatus } from '../common/enums/order-status';
import { PaymentSnapshotStatus } from '../common/enums/payment-snapshot-status';
import { SettlementDateType } from '../common/enums/settlement-date-type';
import { SettlementStatus } from '../common/enums/settlement-status';
import { SettlementSumSearchDTO } from './dtos/settlement-sum-search.dto';
import { SettlementStatusFormDTO } from './dtos/settlement-status-form.dto';
import { SettlementDateFormDTO } from './dtos/settlement-date-form.dto';
import { SettlementDetailSearchDTO } from './dtos/settlement-detail-search.dto';
import { SettlementSearchDTO } from './dtos/settlement-search.dto';
import { SettlementSumStatisticsDTO } from './dtos/settlement-sum-statistics.dto';
import { SettlementDetailStatisticsDTO } from './dtos/settlement-detail-statistics.dto';
import { SettlementSumStoreDTO } from './dtos/settlement-sum-store.dto';
import { SettlementStatisticsDTO } from './dtos/settlement-statistics.dto';
import { SettlementDashboardSearchDTO } from './dtos/settlement-dashboard-search.dto';
import { SettlementDailySumDTO } from './dtos/settlement-daily-sum.dto';
import { SettlementDashboardDTO } from './dtos/settlement-dashboard.dto';
import { SettlementDashboardStatisticsDTO } from './dtos/settlement-dashboard-statistics.dto';
import { SettlementStoreStatisticsDTO } from './dtos/settlement-store-statistics.dto';
import { SettlementStoreSearchDTO } from './dtos/settlement-store-search.dto';
import { SettlementStoreDateType } from 'src/common/enums/settlement-store-date-type';
import { SettlementStoreDailySumDTO } from './dtos/settlement-store-daily-sum.dto';
import { SettlementStoreDashboardDTO } from './dtos/settlement-store-dashboard.dto';
import { SettlementStoreDashboardStatisticsDTO } from './dtos/settlement-store-dashboard-statistics.dto';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);
  private readonly targetMonth: number = 3;
  private readonly seoulToUtcHour: number = -9;
  private readonly utcToSeoulHour: number = 9;
  private readonly nextDayHour: number = 3;
  private readonly agency: number = 3.0;
  private readonly billing: number = 3.2;
  private readonly delivery: number = 3.0;
  private readonly vat: number = 0.1;

  constructor(
    private readonly paymentSnapshotsService: PaymentSnapshotsService,
    private readonly storesService: StoresService,
    private readonly ownersService: OwnersService,
    @InjectRepository(SettlementEntity)
    private readonly settlementsRepository: Repository<SettlementEntity>,
    @InjectRepository(SettlementFeeEntity)
    private readonly settlementFeesRepository: Repository<SettlementFeeEntity>,
    @InjectRepository(SettlementSumEntity)
    private readonly settlementSumsRepository: Repository<SettlementSumEntity>,
    @InjectRepository(SettlementSumSnapshotEntity)
    private readonly settlementSumSnapshotsRepository: Repository<SettlementSumSnapshotEntity>,
  ) {}

  async getSettlementSumList(
    settlementSumSearchDTO: SettlementSumSearchDTO,
  ): Promise<Pagination<SettlementSumEntity, IPaginationMeta>> {
    const queryBuilder = this.settlementSumsRepository.createQueryBuilder('ss');
    queryBuilder.select([
      'ss.id',
      'ss.createdAt',
      'ss.createdDate',
      'ss.expectedDate',
      'ss.doneDate',
      'ss.storeId',
      'ss.storeName',
      'ss.businessName',
      'ss.businessNumber',
      'ss.orderCount',
      'ss.salesAmount',
      'ss.paymentAmount',
      'ss.settlementAmount',
      'ss.deductionAmount',
      'ss.dnggCouponAmount',
      'ss.vatAmount',
      'ss.status',
    ]);
    // 조건문 생성
    await this.setSettlementSumWhere(settlementSumSearchDTO, queryBuilder);
    // 데이터생성일 또는 정산완료일
    const dateType = settlementSumSearchDTO.dateType;
    if (dateType === SettlementDateType.CreatedDate) {
      // 정렬 기준 > 데이터생성일 최신순
      queryBuilder.orderBy('ss.createdAt', 'DESC');
    } else {
      // 정렬 기준 > 정산완료 최신순
      queryBuilder.orderBy('ss.doneAt', 'DESC');
    }

    const settlementSumList = paginate<SettlementSumEntity>(
      queryBuilder,
      settlementSumSearchDTO.getIPaginationOptions(),
    );

    return settlementSumList;
  }

  async getSettlementSumStatistics(
    settlementSumSearchDTO: SettlementSumSearchDTO,
  ): Promise<any> {
    const queryBuilder = this.settlementSumsRepository.createQueryBuilder('ss');
    queryBuilder.select([
      'SUM(ss.salesAmount) AS totalSalesAmount',
      'SUM(ss.settlementAmount) AS totalSettlementAmount',
      'SUM(ss.deductionAmount) AS totalDeductionAmount',
      'SUM(ss.vatAmount) AS totalVatAmount',
      'COUNT(ss.readyDate) AS readyCount',
      'COUNT(ss.doneDate) AS doneCount',
      'COUNT(ss.pendingDate) AS pendingCount',
    ]);
    // 조건문 생성
    await this.setSettlementSumWhere(settlementSumSearchDTO, queryBuilder);
    const settlementSumStatistics = await queryBuilder.getRawOne();
    // 가게별 정산 통계 DTO 변환
    const settlementSumStatisticsDTO = new SettlementSumStatisticsDTO();
    settlementSumStatisticsDTO.totalSalesAmount = parseInt(
      settlementSumStatistics.totalSalesAmount === null
        ? 0
        : settlementSumStatistics.totalSalesAmount,
    );
    settlementSumStatisticsDTO.totalSettlementAmount = parseInt(
      settlementSumStatistics.totalSettlementAmount === null
        ? 0
        : settlementSumStatistics.totalSettlementAmount,
    );
    settlementSumStatisticsDTO.totalDeductionAmount = parseInt(
      settlementSumStatistics.totalDeductionAmount === null
        ? 0
        : settlementSumStatistics.totalDeductionAmount,
    );
    settlementSumStatisticsDTO.totalVatAmount = parseInt(
      settlementSumStatistics.totalVatAmount === null
        ? 0
        : settlementSumStatistics.totalVatAmount,
    );
    settlementSumStatisticsDTO.readyCount = parseInt(
      settlementSumStatistics.readyCount === null
        ? 0
        : settlementSumStatistics.readyCount,
    );
    settlementSumStatisticsDTO.doneCount = parseInt(
      settlementSumStatistics.doneCount === null
        ? 0
        : settlementSumStatistics.doneCount,
    );
    settlementSumStatisticsDTO.pendingCount = parseInt(
      settlementSumStatistics.pendingCount === null
        ? 0
        : settlementSumStatistics.pendingCount,
    );

    return settlementSumStatisticsDTO;
  }

  private async setSettlementSumWhere(
    settlementSumSearchDTO: SettlementSumSearchDTO,
    queryBuilder: SelectQueryBuilder<SettlementSumEntity>,
  ): Promise<void> {
    const { dateType, fromDate, toDate, status, keyword, limit } =
      settlementSumSearchDTO;

    // 조회기간 시작일(UTC 시간)
    const from = new Date(
      parseInt(fromDate.substring(0, 4)),
      parseInt(fromDate.substring(5, 7)) - 1,
      parseInt(fromDate.substring(8)),
      this.seoulToUtcHour,
      0,
      0,
      0,
    );
    // 조회기간 종료일(UTC 시간)
    const to = new Date(
      parseInt(toDate.substring(0, 4)),
      parseInt(toDate.substring(5, 7)) - 1,
      parseInt(toDate.substring(8)) + 1,
      this.seoulToUtcHour,
      0,
      0,
      0,
    );
    // 조회기간이 3개월 이하인지 체크
    const target = new Date(
      to.getFullYear(),
      to.getMonth() - this.targetMonth,
      to.getDate(),
      to.getHours(),
      0,
      0,
      0,
    );
    // CSV 파일 다운로드(limit가 0)의 경우 3개월 제한
    // 시작일이 2022-06-01이면 종료일이 2022-08-31까지
    if (limit == 0 && target.getTime() > from.getTime()) {
      throw new BadRequestException(
        `3개월 이하만 검색이 가능합니다. 시작일: ${fromDate}, 종료일: ${toDate}`,
      );
    }
    // 조건문 생성
    queryBuilder.where('1 = 1');
    // 데이터생성일 또는 정산완료일
    if (dateType === SettlementDateType.CreatedDate) {
      queryBuilder.andWhere('ss.createdAt > :from', { from });
      queryBuilder.andWhere('ss.createdAt < :to', { to });
    } else {
      queryBuilder.andWhere('ss.doneAt IS NOT NULL');
      queryBuilder.andWhere('ss.doneAt > :from', { from });
      queryBuilder.andWhere('ss.doneAt < :to', { to });
    }
    // 구분(ready:정산대기, done:정산완료, pending:정산보류) 설정
    if (status) {
      queryBuilder.andWhere('ss.status = :status', { status });
    }
    // 검색 조건(상호명, 사업자등록번호)
    if (keyword) {
      queryBuilder.andWhere('ss.businessName like :businessName', {
        businessName: '%' + keyword + '%',
      });
      queryBuilder.orWhere('ss.businessNumber like :businessNumber', {
        businessNumber: '%' + keyword + '%',
      });
    }
  }

  async updateSettlementStatus(
    settlementStatusFormDTO: SettlementStatusFormDTO,
  ): Promise<void> {
    const ids: number[] = settlementStatusFormDTO.ids;
    const status: SettlementStatus = settlementStatusFormDTO.status;

    if (status === SettlementStatus.Ready) {
      throw new BadRequestException(
        `정산완료나 정산보류로만 변경할 수 있습니다.`,
      );
    }
    // 정산완료의 경우
    if (status === SettlementStatus.Done) {
      const doneAt = new Date();
      // doneDate의 경우 KST 기준 + 9시간으로 설정이 필요
      const kstDate = new Date(
        doneAt.getFullYear(),
        doneAt.getMonth(),
        doneAt.getDate(),
        doneAt.getHours() + this.utcToSeoulHour,
        0,
        0,
        0,
      );
      const doneDate = await this.transformDateFormat(kstDate);
      // 정산합계 수정
      await this.settlementSumsRepository.update(
        { id: In(ids) },
        {
          readyDate: null,
          doneAt,
          doneDate,
          pendingDate: null,
          status,
        },
      );
      // 정산 수정
      await this.settlementsRepository.update(
        { settlementSumId: In(ids) },
        {
          readyDate: null,
          doneAt,
          doneDate,
          pendingDate: null,
          status,
        },
      );
    } else {
      // 정산보류의 경우
      const pendingAt = new Date();
      const pendingDate = await this.transformDateFormat(pendingAt);
      // 정산합계 수정
      await this.settlementSumsRepository.update(
        { id: In(ids) },
        {
          readyDate: null,
          doneAt: null,
          doneDate: null,
          pendingDate,
          status,
        },
      );
      // 정산 수정
      await this.settlementsRepository.update(
        { settlementSumId: In(ids) },
        {
          readyDate: null,
          doneAt: null,
          doneDate: null,
          pendingDate,
          status,
        },
      );
    }
    // 정산합계 현황 등록
    const snapshots = [];
    for (let i = 0; i < ids.length; i++) {
      snapshots.push({ settlementSumId: ids[i], status });
    }
    await this.settlementSumSnapshotsRepository.insert(snapshots);
  }

  async updateSettlementDoneStatusAndDate(
    ids: number[],
    doneAt: Date,
  ): Promise<void> {
    const status = SettlementStatus.Done;
    // doneDate의 경우 KST 기준 + 9시간으로 설정이 필요
    const kstDate = new Date(
      doneAt.getFullYear(),
      doneAt.getMonth(),
      doneAt.getDate(),
      doneAt.getHours() + this.utcToSeoulHour,
      0,
      0,
      0,
    );
    const doneDate = await this.transformDateFormat(kstDate);
    // 정산합계 수정
    await this.settlementSumsRepository.update(
      { id: In(ids) },
      {
        readyDate: null,
        doneAt,
        doneDate,
        pendingDate: null,
        status,
      },
    );
    // 정산 수정
    await this.settlementsRepository.update(
      { settlementSumId: In(ids) },
      {
        readyDate: null,
        doneAt,
        doneDate,
        pendingDate: null,
        status,
      },
    );
    // 정산합계 현황 등록(테스트 데이터이기 때문에 생략)
    // const snapshots = [];
    // for (let i = 0; i < ids.length; i++) {
    //   snapshots.push({ settlementSumId: ids[i], status });
    // }
    // await this.settlementSumSnapshotsRepository.insert(snapshots);
  }

  async updateSettlementDate(
    settlementDateFormDTO: SettlementDateFormDTO,
  ): Promise<void> {
    const ids: number[] = settlementDateFormDTO.ids;
    const expectedDate: string = settlementDateFormDTO.expectedDate;
    // 정산합계 expectedDate 수정
    await this.settlementSumsRepository.update(
      { id: In(ids) },
      {
        expectedDate,
      },
    );
    // 정산 expectedDate 수정
    await this.settlementsRepository.update(
      { settlementSumId: In(ids) },
      {
        expectedDate,
      },
    );
  }

  async getSettlementDetailList(
    settlementDetailSearchDTO: SettlementDetailSearchDTO,
  ): Promise<Pagination<SettlementEntity, IPaginationMeta>> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select([
      's.id',
      's.createdAt',
      's.createdDate',
      's.expectedDate',
      's.doneDate',
      's.paymentSnapshotId',
      's.paymentSnapshotDate',
      's.paymentSnapshotStatus',
      's.payMethod',
      's.orderNumber',
      's.salesPrice',
      's.orderPrice',
      's.userDeliveryPrice',
      's.paymentPrice',
      's.voucherPrice',
      's.settlementPrice',
      's.deductionPrice',
      's.ownerDeliveryPrice',
      's.discountPrice',
      's.agencyPrice',
      's.billingPrice',
      's.pointPrice',
      's.ownerCouponPrice',
      's.dnggCouponPrice',
      's.vatPrice',
      's.status',
      's.isCancelled',
    ]);
    // 조건문 생성
    await this.setSettlementDetailWhere(
      settlementDetailSearchDTO,
      queryBuilder,
    );
    // 결제현황 최신 생성일순
    queryBuilder.orderBy('s.paymentSnapshotDate', 'DESC');

    const settlementDetailList = paginate<SettlementEntity>(
      queryBuilder,
      settlementDetailSearchDTO.getIPaginationOptions(),
    );

    return settlementDetailList;
  }

  async getSettlementStore(id: number): Promise<any> {
    const queryBuilder = this.settlementSumsRepository.createQueryBuilder('ss');
    queryBuilder.select([
      'ss.createdDate',
      'ss.storeId',
      'ss.storeName',
      'ss.businessName',
    ]);
    queryBuilder.where('ss.id = :id', { id });
    const settlementStore = await queryBuilder.getOne();
    if (!settlementStore) {
      throw new NotFoundException(
        `등록되지 않은 정산합계 데이터입니다.( id: ${id} )`,
      );
    }

    return settlementStore;
  }

  async getSettlementDetailStatistics(
    settlementSumId: number,
    settlementDetailSearchDTO: SettlementDetailSearchDTO,
  ): Promise<any> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select([
      'SUM(s.settlementPrice) AS totalSettlementPrice',
      'SUM(s.salesPrice) AS totalSalesPrice',
      'SUM(s.orderPrice) AS totalOrderPrice',
      'SUM(s.userDeliveryPrice) AS totalUserDeliveryPrice',
      'SUM(s.deductionPrice) AS totalDeductionPrice',
      'SUM(s.billingPrice) AS totalBillingPrice',
      'SUM(s.ownerDeliveryPrice) AS totalOwnerDeliveryPrice',
      'SUM(s.discountPrice) AS totalDiscountPrice',
      'SUM(s.agencyPrice) AS totalAgencyPrice',
      'SUM(s.pointPrice) AS totalPointPrice',
      'SUM(s.ownerCouponPrice) AS totalOwnerCouponPrice',
      'SUM(s.paymentPrice) AS totalPaymentPrice',
      'SUM(s.dnggCouponPrice) AS totalDnggCouponPrice',
      'SUM(s.vatPrice) AS totalVatPrice',
    ]);
    // 조건문 생성
    await this.setSettlementDetailWhere(
      settlementDetailSearchDTO,
      queryBuilder,
    );
    const settlementDetailStatistics = await queryBuilder.getRawOne();
    // 가게상세
    const settlementStore = await this.getSettlementStore(settlementSumId);
    // 가게상세 및 정산상세 통계 DTO 변환
    const settlementDetailStatisticsDTO = new SettlementDetailStatisticsDTO();
    const settlementSumStore = new SettlementSumStoreDTO();
    settlementSumStore.createdDate = settlementStore.createdDate;
    settlementSumStore.storeId = settlementStore.storeId;
    settlementSumStore.storeName = settlementStore.storeName;
    settlementSumStore.businessName = settlementStore.businessName;
    settlementDetailStatisticsDTO.settlementSum = settlementSumStore;
    settlementDetailStatisticsDTO.totalSettlementPrice = parseInt(
      settlementDetailStatistics.totalSettlementPrice === null
        ? 0
        : settlementDetailStatistics.totalSettlementPrice,
    );
    settlementDetailStatisticsDTO.totalSalesPrice = parseInt(
      settlementDetailStatistics.totalSalesPrice === null
        ? 0
        : settlementDetailStatistics.totalSalesPrice,
    );
    settlementDetailStatisticsDTO.totalOrderPrice = parseInt(
      settlementDetailStatistics.totalOrderPrice === null
        ? 0
        : settlementDetailStatistics.totalOrderPrice,
    );
    settlementDetailStatisticsDTO.totalUserDeliveryPrice = parseInt(
      settlementDetailStatistics.totalUserDeliveryPrice === null
        ? 0
        : settlementDetailStatistics.totalUserDeliveryPrice,
    );
    settlementDetailStatisticsDTO.totalDeductionPrice = parseInt(
      settlementDetailStatistics.totalDeductionPrice === null
        ? 0
        : settlementDetailStatistics.totalDeductionPrice,
    );
    settlementDetailStatisticsDTO.totalBillingPrice = parseInt(
      settlementDetailStatistics.totalBillingPrice === null
        ? 0
        : settlementDetailStatistics.totalBillingPrice,
    );
    settlementDetailStatisticsDTO.totalOwnerDeliveryPrice = parseInt(
      settlementDetailStatistics.totalOwnerDeliveryPrice === null
        ? 0
        : settlementDetailStatistics.totalOwnerDeliveryPrice,
    );
    settlementDetailStatisticsDTO.totalDiscountPrice = parseInt(
      settlementDetailStatistics.totalDiscountPrice === null
        ? 0
        : settlementDetailStatistics.totalDiscountPrice,
    );
    settlementDetailStatisticsDTO.totalAgencyPrice = parseInt(
      settlementDetailStatistics.totalAgencyPrice === null
        ? 0
        : settlementDetailStatistics.totalAgencyPrice,
    );
    settlementDetailStatisticsDTO.totalPointPrice = parseInt(
      settlementDetailStatistics.totalPointPrice === null
        ? 0
        : settlementDetailStatistics.totalPointPrice,
    );
    settlementDetailStatisticsDTO.totalOwnerCouponPrice = parseInt(
      settlementDetailStatistics.totalOwnerCouponPrice === null
        ? 0
        : settlementDetailStatistics.totalOwnerCouponPrice,
    );
    settlementDetailStatisticsDTO.totalPaymentPrice = parseInt(
      settlementDetailStatistics.totalPaymentPrice === null
        ? 0
        : settlementDetailStatistics.totalPaymentPrice,
    );
    settlementDetailStatisticsDTO.totalDnggCouponPrice = parseInt(
      settlementDetailStatistics.totalDnggCouponPrice === null
        ? 0
        : settlementDetailStatistics.totalDnggCouponPrice,
    );
    settlementDetailStatisticsDTO.totalVatPrice = parseInt(
      settlementDetailStatistics.totalVatPrice === null
        ? 0
        : settlementDetailStatistics.totalVatPrice,
    );

    return settlementDetailStatisticsDTO;
  }

  private async setSettlementDetailWhere(
    settlementDetailSearchDTO: SettlementDetailSearchDTO,
    queryBuilder: SelectQueryBuilder<SettlementEntity>,
  ): Promise<void> {
    const { id, status, payMethod } = settlementDetailSearchDTO;
    // 정산합계 아이디 설정
    queryBuilder.where('s.settlementSumId = :id', { id });
    // 결제상태(status) 설정
    if (status) {
      queryBuilder.andWhere('s.paymentSnapshotStatus = :status', { status });
    }
    // 결제수단 설정
    if (payMethod) {
      queryBuilder.andWhere('s.payMethod = :payMethod', { payMethod });
    }
  }

  async getSettlementList(
    settlementSearchDTO: SettlementSearchDTO,
  ): Promise<Pagination<SettlementEntity, IPaginationMeta>> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select([
      's.id',
      's.createdAt',
      's.createdDate',
      's.expectedDate',
      's.doneDate',
      's.paymentSnapshotId',
      's.orderNumber',
      's.paymentPrice',
      's.settlementPrice',
      's.salesPrice',
      's.deductionPrice',
      's.dnggCouponPrice',
      's.vatPrice',
      's.status',
      's.isCancelled',
    ]);
    // 조건문 생성
    await this.setSettlementWhere(settlementSearchDTO, queryBuilder);
    // 데이터생성일 또는 정산완료일
    const dateType = settlementSearchDTO.dateType;
    if (dateType === SettlementDateType.CreatedDate) {
      // 정렬 기준 > 데이터생성일 최신순
      queryBuilder.orderBy('s.createdAt', 'DESC');
    } else {
      // 정렬 기준 > 정산완료 최신순
      queryBuilder.orderBy('s.doneAt', 'DESC');
    }

    const settlementList = paginate<SettlementEntity>(
      queryBuilder,
      settlementSearchDTO.getIPaginationOptions(),
    );

    return settlementList;
  }

  async getSettlementStatistics(
    settlementSearchDTO: SettlementSearchDTO,
  ): Promise<any> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select([
      'SUM(s.settlementPrice) AS totalSettlementPrice',
      'SUM(s.salesPrice) AS totalSalesPrice',
      'SUM(s.deductionPrice) AS totalDeductionPrice',
      'SUM(s.vatPrice) AS totalVatPrice',
      'COUNT(s.readyDate) AS readyCount',
      'COUNT(s.doneDate) AS doneCount',
      'COUNT(s.pendingDate) AS pendingCount',
    ]);
    // 조건문 생성
    await this.setSettlementWhere(settlementSearchDTO, queryBuilder);
    const settlementStatistics = await queryBuilder.getRawOne();
    // 주문별 정산 통계 DTO 변환
    const settlementStatisticsDTO = new SettlementStatisticsDTO();
    settlementStatisticsDTO.totalSettlementPrice = parseInt(
      settlementStatistics.totalSettlementPrice === null
        ? 0
        : settlementStatistics.totalSettlementPrice,
    );
    settlementStatisticsDTO.totalSalesPrice = parseInt(
      settlementStatistics.totalSalesPrice === null
        ? 0
        : settlementStatistics.totalSalesPrice,
    );
    settlementStatisticsDTO.totalDeductionPrice = parseInt(
      settlementStatistics.totalDeductionPrice === null
        ? 0
        : settlementStatistics.totalDeductionPrice,
    );
    settlementStatisticsDTO.totalVatPrice = parseInt(
      settlementStatistics.totalVatPrice === null
        ? 0
        : settlementStatistics.totalVatPrice,
    );
    settlementStatisticsDTO.readyCount = parseInt(
      settlementStatistics.readyCount,
    );
    settlementStatisticsDTO.doneCount = parseInt(
      settlementStatistics.doneCount,
    );
    settlementStatisticsDTO.pendingCount = parseInt(
      settlementStatistics.pendingCount,
    );

    return settlementStatisticsDTO;
  }

  private async setSettlementWhere(
    settlementSearchDTO: SettlementSearchDTO,
    queryBuilder: SelectQueryBuilder<SettlementEntity>,
  ): Promise<void> {
    const { dateType, fromDate, toDate, status, keyword, limit } =
      settlementSearchDTO;

    // 조회기간 시작일(UTC 시간)
    const from = new Date(
      parseInt(fromDate.substring(0, 4)),
      parseInt(fromDate.substring(5, 7)) - 1,
      parseInt(fromDate.substring(8)),
      this.seoulToUtcHour,
      0,
      0,
      0,
    );
    // 조회기간 종료일(UTC 시간)
    const to = new Date(
      parseInt(toDate.substring(0, 4)),
      parseInt(toDate.substring(5, 7)) - 1,
      parseInt(toDate.substring(8)) + 1,
      this.seoulToUtcHour,
      0,
      0,
      0,
    );
    // 조회기간이 3개월 이하인지 체크
    const target = new Date(
      to.getFullYear(),
      to.getMonth() - this.targetMonth,
      to.getDate(),
      to.getHours(),
      0,
      0,
      0,
    );
    // CSV 파일 다운로드(limit가 0)의 경우 3개월 제한
    // 시작일이 2022-06-01이면 종료일이 2022-08-31까지
    if (limit == 0 && target.getTime() > from.getTime()) {
      throw new BadRequestException(
        `3개월 이하만 검색이 가능합니다. 시작일: ${fromDate}, 종료일: ${toDate}`,
      );
    }
    // 조건문 생성
    queryBuilder.where('1 = 1');
    // 데이터생성일 또는 정산완료일
    if (dateType === SettlementDateType.CreatedDate) {
      queryBuilder.andWhere('s.createdAt > :from', { from });
      queryBuilder.andWhere('s.createdAt < :to', { to });
    } else {
      queryBuilder.andWhere('s.doneAt IS NOT NULL');
      queryBuilder.andWhere('s.doneAt > :from', { from });
      queryBuilder.andWhere('s.doneAt < :to', { to });
    }
    // 구분(ready:정산대기, done:정산완료, pending:정산보류) 설정
    if (status) {
      queryBuilder.andWhere('s.status = :status', { status });
    }
    // 검색 조건(주문번호)
    if (keyword) {
      queryBuilder.andWhere('s.orderNumber like :orderNumber', {
        orderNumber: '%' + keyword + '%',
      });
    }
  }

  async getSettlementStoreList(
    settlementStoreSearchDTO: SettlementStoreSearchDTO,
  ): Promise<Pagination<SettlementEntity, IPaginationMeta>> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select([
      's.id',
      's.expectedDate',
      's.doneDate',
      's.paymentSnapshotId',
      's.paymentSnapshotDate',
      's.paymentSnapshotStatus',
      's.orderNumber',
      's.salesPrice',
      's.orderPrice',
      's.userDeliveryPrice',
      's.paymentPrice',
      's.voucherPrice',
      's.settlementPrice',
      's.deductionPrice',
      's.ownerDeliveryPrice',
      's.discountPrice',
      's.agencyPrice',
      's.billingPrice',
      's.pointPrice',
      's.ownerCouponPrice',
      's.dnggCouponPrice',
      's.vatPrice',
      's.status',
    ]);
    // 결제(최소) 제외 > 결제에 포함(2022-09-27 협의)
    //queryBuilder.andWhere('s.isCancelled = :cancelled', { cancelled: false });
    // 조건문 생성
    await this.setSettlementStoreWhere(settlementStoreSearchDTO, queryBuilder);
    // 최신 결제현황 생성일순
    queryBuilder.orderBy('s.paymentSnapshotDate', 'DESC');

    const settlementList = paginate<SettlementEntity>(
      queryBuilder,
      settlementStoreSearchDTO.getIPaginationOptions(),
    );

    return settlementList;
  }

  async getSettlementStoreStatistics(
    settlementStoreSearchDTO: SettlementStoreSearchDTO,
  ): Promise<any> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select(['SUM(s.settlementPrice) AS totalSettlementPrice']);
    // 조건문 생성
    await this.setSettlementStoreWhere(settlementStoreSearchDTO, queryBuilder);
    const settlementStatistics = await queryBuilder.getRawOne();
    // 주문별 정산 통계 DTO 변환
    const settlementStoreStatisticsDTO = new SettlementStoreStatisticsDTO();
    settlementStoreStatisticsDTO.totalSettlementPrice = parseInt(
      settlementStatistics.totalSettlementPrice === null
        ? 0
        : settlementStatistics.totalSettlementPrice,
    );

    return settlementStoreStatisticsDTO;
  }

  private async setSettlementStoreWhere(
    settlementStoreSearchDTO: SettlementStoreSearchDTO,
    queryBuilder: SelectQueryBuilder<SettlementEntity>,
  ): Promise<void> {
    const { dateType, fromDate, toDate, limit } = settlementStoreSearchDTO;

    // 조회기간 시작일(UTC 시간)
    const from = new Date(
      parseInt(fromDate.substring(0, 4)),
      parseInt(fromDate.substring(5, 7)) - 1,
      parseInt(fromDate.substring(8)),
      this.seoulToUtcHour,
      0,
      0,
      0,
    );
    // 조회기간 종료일(UTC 시간)
    const to = new Date(
      parseInt(toDate.substring(0, 4)),
      parseInt(toDate.substring(5, 7)) - 1,
      parseInt(toDate.substring(8)) + 1,
      this.seoulToUtcHour,
      0,
      0,
      0,
    );
    // 조회기간이 3개월 이하인지 체크
    const target = new Date(
      to.getFullYear(),
      to.getMonth() - this.targetMonth,
      to.getDate(),
      to.getHours(),
      0,
      0,
      0,
    );
    // CSV 파일 다운로드(limit가 0)의 경우 3개월 제한
    // 시작일이 2022-06-01이면 종료일이 2022-08-31까지
    if (limit == 0 && target.getTime() > from.getTime()) {
      throw new BadRequestException(
        `3개월 이하만 검색이 가능합니다. 시작일: ${fromDate}, 종료일: ${toDate}`,
      );
    }
    // 조건문 생성
    queryBuilder.where('1 = 1');
    // 정산예정일 또는 정산완료일
    if (dateType === SettlementStoreDateType.ExpectedDate) {
      queryBuilder.andWhere("STR_TO_DATE(s.expectedDate, '%Y-%m-%d') > :from", {
        from,
      });
      queryBuilder.andWhere("STR_TO_DATE(s.expectedDate, '%Y-%m-%d') < :to", {
        to,
      });
    } else {
      queryBuilder.andWhere('s.doneAt IS NOT NULL');
      queryBuilder.andWhere('s.doneAt > :from', { from });
      queryBuilder.andWhere('s.doneAt < :to', { to });
    }
  }

  async getSettlementDashboard(
    settlementDashboardSearchDTO: SettlementDashboardSearchDTO,
  ): Promise<any> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    // 정산금액, 중개수수료, 공제금액
    queryBuilder.select([
      'SUBSTRING(DATE_ADD(s.doneAt, INTERVAL 9 HOUR), 1, 10) AS sumDate',
      'SUM(s.settlementPrice) AS dailySettlementPrice',
      'SUM(s.agencyPrice) AS dailyAgencyPrice',
      'SUM(s.deductionPrice) AS dailyDeductionPrice',
      'COUNT(s.id) AS dailyDoneCount',
    ]);
    // 정산완료 대상
    queryBuilder.where('s.doneAt IS NOT NULL');
    // 시작일, 종료일
    const { fromDate, toDate } = settlementDashboardSearchDTO;
    //this.logger.log('fromDate : ' + fromDate);
    // 조회기간 설정(fromDate)
    if (fromDate) {
      // 시작일(UTC 시간)
      const from = new Date(
        parseInt(fromDate.substring(0, 4)),
        parseInt(fromDate.substring(5, 7)) - 1,
        parseInt(fromDate.substring(8)),
        this.seoulToUtcHour,
        0,
        0,
        0,
      );
      queryBuilder.andWhere('s.doneAt > :from', { from });
    }
    // 조회기간 설정(toDate)
    if (toDate) {
      // 종료일(UTC 시간)
      const to = new Date(
        parseInt(toDate.substring(0, 4)),
        parseInt(toDate.substring(5, 7)) - 1,
        parseInt(toDate.substring(8)) + 1,
        this.seoulToUtcHour,
        0,
        0,
        0,
      );
      queryBuilder.andWhere('s.doneAt < :to', { to });
    }
    queryBuilder.groupBy('sumDate');
    queryBuilder.orderBy('sumDate', 'ASC');
    const settlementDailySums = await queryBuilder.getRawMany();

    let totalSettlementPrice = 0;
    let totalAgencyPrice = 0;
    let totalDeductionPrice = 0;
    let doneCount = 0;
    const dailySums = [];
    for (let i = 0; i < settlementDailySums.length; i++) {
      const settlementDailySum = settlementDailySums[i];
      const settlementDailySumDTO = new SettlementDailySumDTO();
      settlementDailySumDTO.sumDate = settlementDailySum.sumDate;
      settlementDailySumDTO.dailySettlementPrice = parseInt(
        settlementDailySum.dailySettlementPrice,
      );
      totalSettlementPrice += settlementDailySumDTO.dailySettlementPrice;

      settlementDailySumDTO.dailyAgencyPrice = parseInt(
        settlementDailySum.dailyAgencyPrice,
      );
      totalAgencyPrice += settlementDailySumDTO.dailyAgencyPrice;

      settlementDailySumDTO.dailyDeductionPrice = parseInt(
        settlementDailySum.dailyDeductionPrice,
      );
      totalDeductionPrice += settlementDailySumDTO.dailyDeductionPrice;

      settlementDailySumDTO.dailyDoneCount = parseInt(
        settlementDailySum.dailyDoneCount,
      );
      doneCount += settlementDailySumDTO.dailyDoneCount;

      dailySums[i] = settlementDailySumDTO;
    }
    // 정산관리 대시보드 DTO
    const settlementDashboardDTO = new SettlementDashboardDTO();
    // 정산관리 통계 DTO 변환
    const settlementDashboardStatisticsDTO =
      new SettlementDashboardStatisticsDTO();
    settlementDashboardStatisticsDTO.totalSettlementPrice =
      totalSettlementPrice;
    settlementDashboardStatisticsDTO.totalAgencyPrice = totalAgencyPrice;
    settlementDashboardStatisticsDTO.totalDeductionPrice = totalDeductionPrice;
    settlementDashboardStatisticsDTO.doneCount = doneCount;
    settlementDashboardDTO.statistics = settlementDashboardStatisticsDTO;
    // 정산관리 일별 합계(차트) DTO 변환
    settlementDashboardDTO.dailySums = dailySums;

    return settlementDashboardDTO;
  }

  async getSettlementStoreDashboard(
    storeId: number,
    settlementDashboardSearchDTO: SettlementDashboardSearchDTO,
  ): Promise<any> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    // 정산금액, 공제금액
    // 공제금액 상세(점주부담 배달료, 중개수수료, 결제수수료, 포인트, 사장님 쿠폰)
    queryBuilder.select([
      'SUBSTRING(DATE_ADD(s.doneAt, INTERVAL 9 HOUR), 1, 10) AS sumDate',
      'SUM(s.settlementPrice) AS dailySettlementPrice',
      'SUM(s.salesPrice) AS dailySalesPrice',
      'SUM(s.orderPrice) AS dailyOrderPrice',
      'SUM(s.userDeliveryPrice) AS dailyUserDeliveryPrice',
      'SUM(s.deductionPrice) AS dailyDeductionPrice',
      'SUM(s.billingPrice) AS dailyBillingPrice',
      'SUM(s.ownerDeliveryPrice) AS dailyOwnerDeliveryPrice',
      'SUM(s.discountPrice) AS dailyDiscountPrice',
      'SUM(s.agencyPrice) AS dailyAgencyPrice',
      'SUM(s.pointPrice) AS dailyPointPrice',
      'SUM(s.ownerCouponPrice) AS dailyOwnerCouponPrice',
      'SUM(s.paymentPrice) AS dailyPaymentPrice',
      'SUM(s.dnggCouponPrice) AS dailyDnggCouponPrice',
      'SUM(s.vatPrice) AS dailyVatPrice',
      'COUNT(s.id) AS dailyDoneCount',
    ]);
    // 정산완료 대상
    queryBuilder.where('s.doneAt IS NOT NULL');
    // storeId 설정
    queryBuilder.andWhere('s.storeId = :storeId', { storeId });
    // 시작일, 종료일
    const { fromDate, toDate } = settlementDashboardSearchDTO;
    //this.logger.log('fromDate : ' + fromDate);
    // 조회기간 설정(fromDate)
    if (fromDate) {
      // 시작일(UTC 시간)
      const from = new Date(
        parseInt(fromDate.substring(0, 4)),
        parseInt(fromDate.substring(5, 7)) - 1,
        parseInt(fromDate.substring(8)),
        this.seoulToUtcHour,
        0,
        0,
        0,
      );
      queryBuilder.andWhere('s.doneAt > :from', { from });
    }
    // 조회기간 설정(toDate)
    if (toDate) {
      // 종료일(UTC 시간)
      const to = new Date(
        parseInt(toDate.substring(0, 4)),
        parseInt(toDate.substring(5, 7)) - 1,
        parseInt(toDate.substring(8)) + 1,
        this.seoulToUtcHour,
        0,
        0,
        0,
      );
      queryBuilder.andWhere('s.doneAt < :to', { to });
    }
    queryBuilder.groupBy('sumDate');
    queryBuilder.orderBy('sumDate', 'ASC');
    const settlementStoreDailySums = await queryBuilder.getRawMany();

    let totalSettlementPrice = 0;
    let totalDeductionPrice = 0;
    let totalOwnerDeliveryPrice = 0;
    let totalAgencyPrice = 0;
    let totalBillingPrice = 0;
    let totalPointPrice = 0;
    let totalOwnerCouponPrice = 0;
    let doneCount = 0;
    const dailySums = [];
    for (let i = 0; i < settlementStoreDailySums.length; i++) {
      const settlementStoreDailySum = settlementStoreDailySums[i];
      const settlementStoreDailySumDTO = new SettlementStoreDailySumDTO();
      settlementStoreDailySumDTO.sumDate = settlementStoreDailySum.sumDate;
      settlementStoreDailySumDTO.dailySettlementPrice = parseInt(
        settlementStoreDailySum.dailySettlementPrice,
      );
      totalSettlementPrice += settlementStoreDailySumDTO.dailySettlementPrice;

      settlementStoreDailySumDTO.dailyDeductionPrice = parseInt(
        settlementStoreDailySum.dailyDeductionPrice,
      );
      totalDeductionPrice += settlementStoreDailySumDTO.dailyDeductionPrice;

      settlementStoreDailySumDTO.dailyOwnerDeliveryPrice = parseInt(
        settlementStoreDailySum.dailyOwnerDeliveryPrice,
      );
      totalOwnerDeliveryPrice +=
        settlementStoreDailySumDTO.dailyOwnerDeliveryPrice;

      settlementStoreDailySumDTO.dailyAgencyPrice = parseInt(
        settlementStoreDailySum.dailyAgencyPrice,
      );
      totalAgencyPrice += settlementStoreDailySumDTO.dailyAgencyPrice;

      settlementStoreDailySumDTO.dailyBillingPrice = parseInt(
        settlementStoreDailySum.dailyBillingPrice,
      );
      totalBillingPrice += settlementStoreDailySumDTO.dailyBillingPrice;

      settlementStoreDailySumDTO.dailyAgencyPrice = parseInt(
        settlementStoreDailySum.dailyAgencyPrice,
      );
      totalAgencyPrice += settlementStoreDailySumDTO.dailyAgencyPrice;

      settlementStoreDailySumDTO.dailyPointPrice = parseInt(
        settlementStoreDailySum.dailyPointPrice,
      );
      totalPointPrice += settlementStoreDailySumDTO.dailyPointPrice;

      settlementStoreDailySumDTO.dailyOwnerCouponPrice = parseInt(
        settlementStoreDailySum.dailyOwnerCouponPrice,
      );
      totalOwnerCouponPrice += settlementStoreDailySumDTO.dailyOwnerCouponPrice;

      settlementStoreDailySumDTO.dailyDoneCount = parseInt(
        settlementStoreDailySum.dailyDoneCount,
      );
      doneCount += settlementStoreDailySumDTO.dailyDoneCount;

      dailySums[i] = settlementStoreDailySumDTO;
    }
    // 점주 정산관리 대시보드 DTO
    const settlementStoreDashboardDTO = new SettlementStoreDashboardDTO();
    // 점주 정산관리 통계 DTO 변환
    const settlementStoreDashboardStatisticsDTO =
      new SettlementStoreDashboardStatisticsDTO();
    settlementStoreDashboardStatisticsDTO.totalSettlementPrice =
      totalSettlementPrice;
    settlementStoreDashboardStatisticsDTO.totalDeductionPrice =
      totalDeductionPrice;
    settlementStoreDashboardStatisticsDTO.totalOwnerDeliveryPrice =
      totalOwnerDeliveryPrice;
    settlementStoreDashboardStatisticsDTO.totalAgencyPrice = totalAgencyPrice;
    settlementStoreDashboardStatisticsDTO.totalBillingPrice = totalBillingPrice;
    settlementStoreDashboardStatisticsDTO.totalPointPrice = totalPointPrice;
    settlementStoreDashboardStatisticsDTO.totalOwnerCouponPrice =
      totalOwnerCouponPrice;
    settlementStoreDashboardStatisticsDTO.doneCount = doneCount;
    settlementStoreDashboardDTO.statistics =
      settlementStoreDashboardStatisticsDTO;
    // 점주 정산관리 일별 합계(차트) DTO 변환
    settlementStoreDashboardDTO.dailySums = dailySums;

    return settlementStoreDashboardDTO;
  }

  async createSettlementDatasByDate(settlementDate: Date): Promise<number[]> {
    // 정산합계 아이디 리스트
    const settlementSumIds: number[] = [];
    // 가게 리스트 가져오기
    const storeOwners = await this.storesService.getStoreOwners();
    // 가게별 정산데이터 작성하기
    for (let i = 0; i < storeOwners.length; i++) {
      const storeOwner = storeOwners[i];
      const storeId = storeOwner.storeId;
      const storeName = storeOwner.storeName;
      const businessName = storeOwner.businessName;
      const businessNumber = storeOwner.businessNumber;
      // 결제현황 시작일시(전일 UTC 15시 = 당일 KST 0시)
      const fromDate = new Date(
        settlementDate.getFullYear(),
        settlementDate.getMonth(),
        settlementDate.getDate(),
        this.seoulToUtcHour,
        0,
        0,
        0,
      );
      //this.logger.log('fromDate : ' + fromDate.toLocaleString());
      // 결제현황 종료일시(당일 UTC 15시 = 익일 KST 0시)
      const toDate = new Date(
        settlementDate.getFullYear(),
        settlementDate.getMonth(),
        settlementDate.getDate() + 1,
        this.seoulToUtcHour,
        0,
        0,
        0,
      );
      //this.logger.log('toDate : ' + toDate.toLocaleString());
      // 정산데이터 생성일시(종료일 기준, 당일 UTC 18시 세팅 - 스케줄러 실행시간 기준)
      const createdAt = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate(),
        toDate.getHours() + this.nextDayHour,
        0,
        0,
        0,
      );
      // KST 일자(yyyy-MM-dd), UTC 정산일 + 1일
      const kstDate = new Date(
        settlementDate.getFullYear(),
        settlementDate.getMonth(),
        settlementDate.getDate() + 1,
        0,
        0,
        0,
        0,
      );
      // 정산데이터 생성일(yyyy-MM-dd)
      const createdDate = await this.transformDateFormat(kstDate);
      //this.logger.log('createdDate : ' + createdDate);
      // 가게별 정산합계가 존재하는지 체크
      const isValid = await this.validateSettlementSum(storeId, createdDate);
      if (isValid) {
        // 주문별 정산 생성
        await this.saveSettlement(
          storeId,
          fromDate,
          toDate,
          createdDate,
          createdAt,
        );
        // 가게별 정산 및 정산현황 생성
        const settlementSumId = await this.saveSettlementSum(
          storeId,
          storeName,
          businessName,
          businessNumber,
          createdDate,
          createdAt,
        );
        // 정산합계 아이디 설정
        settlementSumIds.push(settlementSumId);
      }
    }

    return settlementSumIds;
  }

  private async saveSettlement(
    storeId: number,
    fromDate: Date,
    toDate: Date,
    createdDate: string,
    createdAt: Date,
  ): Promise<void> {
    // 정산 수수료 체크
    let settlementFee = await this.settlementFeesRepository.findOne({
      storeId,
    });

    let agency;
    let billing;
    let delivery;
    if (settlementFee) {
      agency = settlementFee.agency;
      billing = settlementFee.billing;
      delivery = settlementFee.delivery;
    } else {
      // 정산 수수료가 없을 경우 기본 정책으로 생성
      agency = this.agency;
      billing = this.billing;
      delivery = this.delivery;
      settlementFee = await this.settlementFeesRepository.save({
        storeId,
        agency,
        billing,
        delivery,
      });
    }
    // 결제일자(지정한 과거일자) 기준 결제현황 데이터
    const paymentSnapshotList =
      await this.paymentSnapshotsService.getPaymentSnapshotListByDates(
        storeId,
        fromDate,
        toDate,
      );
    // 가게별 주문건수
    const orderCount = paymentSnapshotList.length;
    // 정산상태
    const status = SettlementStatus.Ready;
    // 주문별 정산 데이터 생성
    for (let i = 0; i < orderCount; i++) {
      const paymentSnapshot = paymentSnapshotList[i];
      const paymentSnapshotId = paymentSnapshot.paymentSnapshotId;
      const paymentSnapshotStatus = paymentSnapshot.paymentSnapshotStatus;
      const paymentSnapshotDate = paymentSnapshot.paymentSnapshotDate;
      const payMethod = paymentSnapshot.payMethod;
      const orderNumber = paymentSnapshot.orderNumber;
      // 2022-09-07 정책상 사장님할인금액을 총금액에서 제외해야하기 때문에 먼저 설정
      const discountOriginalPrice = paymentSnapshot.discountPrice;
      let discountPrice = 0;
      if (paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled) {
        discountPrice = discountOriginalPrice;
      } else {
        discountPrice = -discountOriginalPrice;
      }
      // 2022-09-07 정책상 주문금액 = 총금액 - 사장님할인금액
      const orderOriginalPrice =
        paymentSnapshot.totalPrice - discountOriginalPrice;
      // 주문취소의 경우 금액 계산은 원래 금액의 마이너스 처리, 이후 일괄 적용
      const orderPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled
          ? -orderOriginalPrice
          : orderOriginalPrice;
      const paymentOriginalPrice = paymentSnapshot.paymentPrice;
      const paymentPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled
          ? -paymentOriginalPrice
          : paymentOriginalPrice;
      const voucherPrice = 0;
      const userDeliveryPrice = 0;
      // 매출금액 = 주문금액 + 고객부담 배달료
      const salesPrice = orderPrice + userDeliveryPrice;
      // TODO 배달료 추가시 점주부담 배달료는 정책에 따라 적용
      const ownerDeliveryPrice = Math.floor(
        userDeliveryPrice * (delivery / 100),
      );
      const salesOriginalPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled
          ? -salesPrice
          : salesPrice;
      // 중개수수료는 매출(주문)금액 기준, 소수점 버림으로 처리
      // 마이너스 처리는 계산이 다르게 되기 때문에 마이너스 가격을 플러스 가격으로 변경 후에 소수점 버림
      const agencyOriginalPrice = Math.floor(
        salesOriginalPrice * (agency / 100),
      );
      const agencyPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled
          ? agencyOriginalPrice
          : -agencyOriginalPrice;
      // 결제수수료는 결제금액 기준, 소수점 버림으로 처리
      // 마이너스 처리는 계산이 다르게 되기 때문에 마이너스 가격을 플러스 가격으로 변경 후에 소수점 버림
      const billingOriginalPrice = Math.floor(
        paymentOriginalPrice * (billing / 100),
      );
      const billingPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled
          ? billingOriginalPrice
          : -billingOriginalPrice;
      // 부가세는 중개수수료 10% + 결제수수료 10% 기준, 각각 소수점 반올림으로 처리
      // 마이너스 처리는 계산이 다르게 되기 때문에 마이너스 가격을 플러스 가격으로 변경 후에 소수점 반올림
      const vatOriginalPrice =
        Math.round(agencyOriginalPrice * this.vat) +
        Math.round(billingOriginalPrice * this.vat);
      const vatPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled
          ? vatOriginalPrice
          : -vatOriginalPrice;
      const pointPrice = 0;
      const couponPrice =
        paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled &&
        paymentSnapshot.couponPrice > 0
          ? -paymentSnapshot.couponPrice
          : paymentSnapshot.couponPrice;
      const couponIssuer = paymentSnapshot.couponIssuer;
      // 2022-09-07 정책상 사장님 할인은 공제금액에서 제외
      let dnggCouponPrice = 0;
      let ownerCouponPrice = 0;
      if (couponIssuer) {
        if (couponIssuer === CouponIssuer.Owner) {
          // 사장님 쿠폰 마이너스 처리, 공제금액에 포함(2022-09-13)
          ownerCouponPrice = -couponPrice;
        } else {
          // 동네가게 쿠폰 플러스 처리
          dnggCouponPrice = couponPrice;
        }
      }
      // 공제금액 계산(결제수수료, 점주부담 배달료, 중개수수료, 포인트, 사장님쿠폰)
      const deductionPrice =
        billingPrice +
        ownerDeliveryPrice +
        agencyPrice +
        pointPrice +
        ownerCouponPrice;
      // 동네가게 쿠폰의 경우는 공제금액 계산에서 제외, 정산금액에서 미포함(2022-09-16)
      // 결제 금액에서는 점주발행 쿠폰, 동네가게 쿠폰 상관없이 계산이 됨
      // 정산금액 계산(주문금액 + 공제금액 + 부가세)
      const settlementPrice = salesPrice + deductionPrice + vatPrice;
      // 주문별 정산 저장
      await this.settlementsRepository.save({
        createdAt,
        createdDate,
        readyDate: createdDate,
        storeId,
        paymentSnapshotId,
        paymentSnapshotDate,
        paymentSnapshotStatus,
        payMethod,
        orderNumber,
        salesPrice,
        orderPrice,
        userDeliveryPrice,
        paymentPrice,
        voucherPrice,
        settlementPrice,
        deductionPrice,
        ownerDeliveryPrice,
        discountPrice,
        agencyPrice,
        billingPrice,
        pointPrice,
        ownerCouponPrice,
        dnggCouponPrice,
        vatPrice,
        status,
      });
      // 결제취소의 경우, 과거 결제완료였던 정산데이터 isCancelled > true 로 변경
      if (paymentSnapshotStatus === PaymentSnapshotStatus.Cancelled) {
        await this.settlementsRepository.update(
          { orderNumber, paymentSnapshotStatus: PaymentSnapshotStatus.Paid },
          { isCancelled: true },
        );
      }
    }
  }

  private async saveSettlementSum(
    storeId: number,
    storeName: string,
    businessName: string,
    businessNumber: string,
    createdDate: string,
    createdAt: Date,
  ): Promise<number> {
    const sumData = await this.getSettlementSum(storeId, createdDate);
    const salesAmount = sumData.salesAmount;
    const orderAmount = sumData.orderAmount;
    const userDeliveryAmount = sumData.userDeliveryAmount;
    const paymentAmount = sumData.paymentAmount;
    const settlementAmount = sumData.settlementAmount;
    const deductionAmount = sumData.deductionAmount;
    const ownerDeliveryAmount = sumData.ownerDeliveryAmount;
    const discountAmount = sumData.discountAmount;
    const agencyAmount = sumData.agencyAmount;
    const billingAmount = sumData.billingAmount;
    const pointAmount = sumData.pointAmount;
    const ownerCouponAmount = sumData.ownerCouponAmount;
    const dnggCouponAmount = sumData.dnggCouponAmount;
    const vatAmount = sumData.vatAmount;
    const orderCount = sumData.orderCount;
    const status = SettlementStatus.Ready;
    if (salesAmount !== null) {
      // 가게별 정산 저장
      const settlementSum = await this.settlementSumsRepository.save({
        createdAt,
        createdDate,
        readyDate: createdDate,
        storeId,
        storeName,
        businessName,
        businessNumber,
        orderCount,
        salesAmount,
        orderAmount,
        userDeliveryAmount,
        paymentAmount,
        settlementAmount,
        deductionAmount,
        ownerDeliveryAmount,
        discountAmount,
        agencyAmount,
        billingAmount,
        pointAmount,
        ownerCouponAmount,
        dnggCouponAmount,
        vatAmount,
        status,
      });
      // 가게별 정산현황 저장
      const settlementSumId = settlementSum.id;
      this.settlementSumSnapshotsRepository.save({
        createdAt,
        settlementSumId,
        status,
      });
      // 주문별 정산 settlementSumId 업데이트
      this.settlementsRepository.update(
        { createdDate, storeId },
        { settlementSumId },
      );

      return settlementSumId;
    }
  }

  private async getSettlementSum(
    storeId: number,
    createdDate: string,
  ): Promise<any> {
    const queryBuilder = this.settlementsRepository.createQueryBuilder('s');
    queryBuilder.select([
      'SUM(s.salesPrice) AS salesAmount',
      'SUM(s.orderPrice) AS orderAmount',
      'SUM(s.userDeliveryPrice) AS userDeliveryAmount',
      'SUM(s.paymentPrice) AS paymentAmount',
      'SUM(s.voucherPrice) AS voucherAmount',
      'SUM(s.settlementPrice) AS settlementAmount',
      'SUM(s.deductionPrice) AS deductionAmount',
      'SUM(s.ownerDeliveryPrice) AS ownerDeliveryAmount',
      'SUM(s.discountPrice) AS discountAmount',
      'SUM(s.agencyPrice) AS agencyAmount',
      'SUM(s.billingPrice) AS billingAmount',
      'SUM(s.pointPrice) AS pointAmount',
      'SUM(s.ownerCouponPrice) AS ownerCouponAmount',
      'SUM(s.dnggCouponPrice) AS dnggCouponAmount',
      'SUM(s.vatPrice) AS vatAmount',
      'COUNT(s.id) AS orderCount',
    ]);
    queryBuilder.where('s.storeId = :storeId', { storeId });
    queryBuilder.andWhere('s.createdDate = :createdDate', { createdDate });
    const settlementSum = await queryBuilder.getRawOne();

    return settlementSum;
  }

  private async validateSettlementSum(
    storeId: number,
    createdDate: string,
  ): Promise<boolean> {
    const settlementSums = await this.settlementSumsRepository.find({
      storeId,
      createdDate,
    });

    if (settlementSums.length === 0) {
      return true;
    }

    return false;
  }

  private async transformDateFormat(createdAt: Date): Promise<string> {
    const year = createdAt.getFullYear();
    const month = ('0' + (createdAt.getMonth() + 1)).slice(-2);
    const dayOfMonth = ('0' + createdAt.getDate()).slice(-2);
    const yyyyMMdd = year + '-' + month + '-' + dayOfMonth;

    return yyyyMMdd;
  }
}
