import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationMeta,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  getConnection,
  getManager,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { PaymentService } from '../payment/payment.service';
import { DnggChpher } from '../common/utils/dnggCipher';
import { OrderStatus } from '../common/enums/order-status';
import { PaymentSnapshotStatus } from '../common/enums/payment-snapshot-status';
import { OrderEntity } from '../common/entities/orders.entity';
import { IamportPaymentEntity } from '../common/entities/iamport-payment.entity';
import { IamportPaymentCancelEntity } from '../common/entities/iamport-payment-cancel.entity';
import { PaymentSnapshotEntity } from '../common/entities/payment-snapshots.entity';
import { PaymentSnapshotSearchDTO } from './dtos/payment-snapshot-search.dto';
import { PaymentSnapshotDTO } from './dtos/payment-snapshot.dto';
import { PaymentSnapshotStatisticsDTO } from './dtos/payment-snapshot-statistics.dto';
import { PaymentSnapshotDashboardSearchDTO } from './dtos/payment-snapshot-dashboard-search.dto';
import { PaymentSnapshotDashboardDTO } from './dtos/payment-snapshot-dashboard.dto';
import { PaymentSnapshotDailySumDTO } from './dtos/payment-snapshot-daily-sum.dto';
import { CouponDownloadEntity } from 'src/common/entities/coupon-download.entity';
import { OrderCancelCode } from 'src/common/enums/order-cancel-code';

@Injectable()
export class PaymentSnapshotsService {
  private readonly logger = new Logger(PaymentSnapshotsService.name);
  private readonly seoulToUtcHour: number = -9;
  private readonly targetMonth: number = 3;

  constructor(
    private readonly paymentService: PaymentService,
    @InjectRepository(PaymentSnapshotEntity)
    private readonly paymentSnapshotsRepository: Repository<PaymentSnapshotEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async getPaymentSnapshotList(
    paymentSnapshotSearchDTO: PaymentSnapshotSearchDTO,
  ): Promise<Pagination<PaymentSnapshotEntity, IPaginationMeta>> {
    const queryBuilder =
      this.paymentSnapshotsRepository.createQueryBuilder('ps');
    queryBuilder.select([
      'ps.id AS id',
      'ps.createdAt AS createdAt',
      'ps.status AS status',
      'o.orderNumber AS orderNumber',
      'o.usingMethod AS usingMethod',
      'o.purchasePrice AS purchasePrice',
      'o.couponPrice AS couponPrice',
      'o.couponIssuer AS couponIssuer',
      'p.payMethod AS payMethod',
      's.name AS storeName',
      'CASE WHEN oc.orderNumber IS NULL THEN false ELSE true END AS isCancelled',
    ]);
    // 조건문 생성
    await this.setPaymentSnapshotWhere(paymentSnapshotSearchDTO, queryBuilder);
    // 최신 생성일순
    queryBuilder.orderBy('ps.createdAt', 'DESC');

    const paymentSnapshotList = paginateRaw<PaymentSnapshotEntity>(
      queryBuilder,
      paymentSnapshotSearchDTO.getIPaginationOptions(),
    );
    return paymentSnapshotList;
  }

  async getPaymentSnapshotStatistics(
    paymentSnapshotSearchDTO: PaymentSnapshotSearchDTO,
  ): Promise<any> {
    const queryBuilder =
      this.paymentSnapshotsRepository.createQueryBuilder('ps');
    queryBuilder.select([
      'SUM(o.purchasePrice) AS totalAllPrice',
      "SUM(CASE WHEN ps.status = 'paid' THEN o.purchasePrice ELSE 0 END) AS totalPaidPrice",
      "SUM(CASE WHEN ps.status = 'cancelled' THEN o.purchasePrice ELSE 0 END) AS totalCancelledPrice",
      'COUNT(ps.id) AS allCount',
      "SUM(CASE WHEN ps.status = 'paid' THEN 1 ELSE 0 END) AS paidCount",
      "SUM(CASE WHEN ps.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelledCount",
    ]);
    // 조건문 생성
    await this.setPaymentSnapshotWhere(paymentSnapshotSearchDTO, queryBuilder);
    const paymentSnapshotStatistics = await queryBuilder.getRawOne();

    // 결제현황 통계 DTO 변환
    const paymentSnapshotStatisticsDTO = new PaymentSnapshotStatisticsDTO();
    paymentSnapshotStatisticsDTO.totalAllPrice = parseInt(
      paymentSnapshotStatistics.totalAllPrice,
    );
    paymentSnapshotStatisticsDTO.totalPaidPrice = parseInt(
      paymentSnapshotStatistics.totalPaidPrice,
    );
    paymentSnapshotStatisticsDTO.totalCancelledPrice = parseInt(
      paymentSnapshotStatistics.totalCancelledPrice,
    );
    paymentSnapshotStatisticsDTO.allCount = parseInt(
      paymentSnapshotStatistics.allCount,
    );
    paymentSnapshotStatisticsDTO.paidCount = parseInt(
      paymentSnapshotStatistics.paidCount,
    );
    paymentSnapshotStatisticsDTO.cancelledCount = parseInt(
      paymentSnapshotStatistics.cancelledCount,
    );

    return paymentSnapshotStatisticsDTO;
  }

  private async setPaymentSnapshotWhere(
    paymentSnapshotSearchDTO: PaymentSnapshotSearchDTO,
    queryBuilder: SelectQueryBuilder<PaymentSnapshotEntity>,
  ): Promise<void> {
    const { fromDate, toDate, status, isCancelled, payMethod, keyword, limit } =
      paymentSnapshotSearchDTO;

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

    queryBuilder.leftJoin('ps.order', 'o');
    queryBuilder.leftJoin('o.impPayment', 'p');
    queryBuilder.leftJoin('o.store', 's');
    // 결제성공의 경우, 나중에 결제취소가 있을 경우 isCancelled 항목 추가
    queryBuilder.leftJoin(
      'ps.order',
      'oc',
      'oc.orderNumber = o.orderNumber AND oc.orderStatus = :orderStatus',
      { orderStatus: OrderStatus.Cancel },
    );
    queryBuilder.where('ps.createdAt > :from', { from });
    queryBuilder.andWhere('ps.createdAt < :to', { to });
    // 구분(paid:결제완료, cancelled:결제취소) 설정
    if (status) {
      queryBuilder.andWhere('ps.status = :status', { status });
      //this.logger.log('isCancelled : ' + isCancelled);
      //결제완료인 경우
      if (
        status === PaymentSnapshotStatus.Paid &&
        isCancelled !== null &&
        isCancelled !== undefined
      ) {
        const cancelled: boolean = JSON.parse(isCancelled);
        if (cancelled) {
          queryBuilder.andWhere('oc.orderNumber IS NOT NULL');
        } else {
          queryBuilder.andWhere('oc.orderNumber IS NULL');
        }
      }
    }
    // 결제수단 설정
    if (payMethod) {
      queryBuilder.andWhere('p.payMethod = :payMethod', { payMethod });
    }
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('o.orderNumber like :orderNumber', {
        orderNumber: '%' + keyword + '%',
      });
      queryBuilder.orWhere('s.name like :name', {
        name: '%' + keyword + '%',
      });
    }
  }

  async getPaymentSnapshotListByDates(
    storeId: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    const queryBuilder =
      this.paymentSnapshotsRepository.createQueryBuilder('ps');
    queryBuilder.select([
      'ps.id AS paymentSnapshotId',
      'ps.createdAt AS paymentSnapshotDate',
      'ps.status AS paymentSnapshotStatus',
      'o.orderNumber AS orderNumber',
      'o.totalPrice AS totalPrice',
      'o.purchasePrice AS paymentPrice',
      'o.discountPrice AS discountPrice',
      'o.couponPrice AS couponPrice',
      'o.couponIssuer AS couponIssuer',
      'p.payMethod AS payMethod',
    ]);
    queryBuilder.leftJoin('ps.order', 'o');
    queryBuilder.leftJoin('o.impPayment', 'p');
    queryBuilder.where('o.store = :storeId', { storeId });
    queryBuilder.andWhere('ps.createdAt > :fromDate', { fromDate });
    queryBuilder.andWhere('ps.createdAt < :toDate', { toDate });
    const paymentSnapshotList = queryBuilder.getRawMany();

    return paymentSnapshotList;
  }

  async getPaymentSnapshotDetail(id: number): Promise<any> {
    const paymentSnapshotDetail = await this.paymentSnapshotsRepository
      .createQueryBuilder('ps')
      .select([
        'ps.id',
        'ps.createdAt',
        'ps.status',
        'o.createdAt',
        'o.orderNumber',
        'o.usingMethod',
        'o.purchasePrice',
        'o.couponPrice',
        'o.couponIssuer',
        'o.orderStatus',
        'o.userId',
        'o.storeId',
        'u.fullName',
        'u.phoneNumber',
        'o.address1',
        'o.address2',
        'o.cookingTime',
        'o.request',
        'p.payMethod',
        'p.cancelReason',
        's.name',
        'om.name',
        'om.number',
        'omp.name',
        'omp.price',
        'omp.discount',
        'ow.businessName',
        'pow.username',
        'pow.fullName',
      ])
      .leftJoin('ps.order', 'o')
      .leftJoin('o.impPayment', 'p')
      .leftJoin('o.store', 's')
      .leftJoin('o.user', 'u')
      .leftJoin('o.orderMenus', 'om')
      .leftJoin('om.orderMenuPrice', 'omp')
      .leftJoin('s.owner', 'ow')
      .leftJoin('ps.createdBy', 'pow')
      .where('ps.id = :id', { id })
      .getOne();

    // 사용자 핸드폰번호 복호화, 탈퇴한 계정이나 휴대폰 번호가 없는 경우 예외 처리
    const user = paymentSnapshotDetail.order.user;
    if (user) {
      const chpher = new DnggChpher();
      const phoneNumber = user.phoneNumber;
      if (phoneNumber) {
        user.phoneNumber = await chpher.decrypt(phoneNumber);
      }
    }

    return paymentSnapshotDetail;
  }

  async updateOrderCancel(ownerId: number, orderId: number, reason: string) {
    // 결제 상태 및 주문 금액 확인
    const order = await this.orderRepository.findOne({ id: orderId });

    if (!order) {
      throw new BadRequestException(
        `잘못된 주문 번호 입니다. orderId : ${orderId}`,
      );
    }
    // 운영자는 모든 상태에 대해 취소 처리 가능
    const iamportPayment =
      await this.paymentService.getIamportPaymentByOrderNumber(
        order.orderNumber,
      );

    // 결제 상태가 아닌 경우
    if (iamportPayment.status != 'paid') {
      throw new BadRequestException(
        `결제 상태가 아닙니다. payment status : ${iamportPayment.status}`,
      );
    }

    const pay = await this.paymentService.cancelPayment(
      iamportPayment.impUid,
      reason,
    );
    // 사용 안하는 옵션 제거
    if (!pay) {
      throw new BadRequestException(
        `결제 취소 할 정보가 없습니다. payment uid : ${iamportPayment.impUid}`,
      );
    }

    if (pay && pay.cancel_receipt_urls) {
      delete pay.cancel_receipt_urls;
    }

    const cancelHistory = pay.cancel_history;

    iamportPayment.impUid = pay.imp_uid;
    iamportPayment.merchantUid = pay.merchant_uid;
    iamportPayment.payMethod = pay.pay_method;
    iamportPayment.channel = pay.channel;
    iamportPayment.pgProvider = pay.pg_provider;
    iamportPayment.embPgProvider = pay.emb_pg_provider;
    iamportPayment.pgTid = pay.pg_tid;
    iamportPayment.pgId = pay.pg_id;
    iamportPayment.escrow = pay.escrow;
    iamportPayment.applyNum = pay.apply_num;
    iamportPayment.bankCode = pay.bank_code;
    iamportPayment.bankName = pay.bank_name;
    iamportPayment.cardCode = pay.card_code;
    iamportPayment.cardName = pay.card_name;
    iamportPayment.cardQuota = pay.card_quota;
    iamportPayment.cardNumber = pay.card_number;
    iamportPayment.cardType = pay.card_type;
    iamportPayment.vbankCode = pay.vbank_code;
    iamportPayment.vbankName = pay.vbank_name;
    iamportPayment.vbankNum = pay.vbank_num;
    iamportPayment.vbankHolder = pay.vbank_holder;
    iamportPayment.vbankDate = pay.vbank_date;
    iamportPayment.vbankIssuedAt = pay.vbank_issued_at;
    iamportPayment.name = pay.name;
    iamportPayment.amount = pay.amount;
    iamportPayment.cancelAmount = pay.cancel_amount;
    iamportPayment.currency = pay.currency;
    iamportPayment.buyerName = pay.buyer_name;
    iamportPayment.buyerEmail = pay.buyer_email;
    iamportPayment.buyerTel = pay.buyer_tel;
    iamportPayment.buyerAddr = pay.buyer_addr;
    iamportPayment.buyerPostcode = pay.buyer_postcode;
    iamportPayment.customData = pay.custom_data;
    iamportPayment.userAgent = pay.user_agent;
    iamportPayment.status = pay.status;
    iamportPayment.startedAt = pay.started_at;
    iamportPayment.paidAt = pay.paid_at;
    iamportPayment.failedAt = pay.failed_at;
    iamportPayment.cancelledAt = pay.cancelled_at;
    iamportPayment.failReason = pay.fail_reason;
    iamportPayment.cancelReason = pay.cancel_reason;
    iamportPayment.receiptUrl = pay.receipt_url;
    iamportPayment.cashReceiptIssued = pay.cash_receipt_issued;
    iamportPayment.customerUid = pay.customer_uid;
    iamportPayment.customerUidUsage = pay.customer_uid_usage;

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .getRepository(IamportPaymentEntity)
        .save(iamportPayment);

      // iamport payment cancel history
      if (cancelHistory && cancelHistory.length > 0) {
        for (let i = 0; i < cancelHistory.length; i++) {
          const iamportPaymentCancel = cancelHistory[i];
          await transactionalEntityManager
            .getRepository(IamportPaymentCancelEntity)
            .save({
              pgTid: iamportPaymentCancel.pg_tid,
              amount: iamportPaymentCancel.amount,
              cancelledAt: iamportPaymentCancel.cancelled_at,
              reason: iamportPaymentCancel.reason,
              receiptUrl: iamportPaymentCancel.receipt_url,
            });
        }
      }

      // 오더 상태 변경
      await transactionalEntityManager
        .createQueryBuilder()
        .update(OrderEntity)
        .where({ id: orderId })
        .set({
          orderStatus: OrderStatus.Cancel,
          cancelCode: OrderCancelCode.Manager,
        })
        .execute();

      // 쿠폰금액이 있는 경우(쿠폰사용)
      if (order.couponPrice > 0) {
        const couponDownloadInfo = await getRepository(CouponDownloadEntity)
          .createQueryBuilder('cd')
          .where('cd.user_id = :uid', {
            uid: order.userId,
          })
          .andWhere('cd.order_id = :oid', { oid: orderId })
          .andWhere('is_use = true')
          .getOne();
        // 쿠폰 미사용으로 변경
        await transactionalEntityManager
          .createQueryBuilder()
          .update(CouponDownloadEntity)
          .where({ id: couponDownloadInfo.id })
          .set({ isUse: false, orderId: null })
          .execute();
      }

      // payment snapshot 추가
      this.paymentSnapshotsRepository.save({
        orderId,
        status: pay.status,
        ownerId,
      });
    });
  }

  async getPaymentSnapshotDashboard(
    paymentSnapshotDashboardSearchDTO: PaymentSnapshotDashboardSearchDTO,
  ): Promise<any> {
    const queryBuilder =
      this.paymentSnapshotsRepository.createQueryBuilder('ps');
    queryBuilder.select([
      'SUBSTRING(DATE_ADD(o.createdAt, INTERVAL 9 HOUR), 1, 10) AS sumDate',
      'SUM(o.purchasePrice) AS dailyAllPrice',
      "SUM(CASE WHEN ps.status = 'paid' THEN o.purchasePrice ELSE 0 END) AS dailyPaidPrice",
      "SUM(CASE WHEN ps.status = 'cancelled' THEN o.purchasePrice ELSE 0 END) AS dailyCancelledPrice",
      'COUNT(ps.id) AS dailyAllCount',
      "SUM(CASE WHEN ps.status = 'paid' THEN 1 ELSE 0 END) AS dailyPaidCount",
      "SUM(CASE WHEN ps.status = 'cancelled' THEN 1 ELSE 0 END) AS dailyCancelledCount",
    ]);
    queryBuilder.leftJoin('ps.order', 'o');
    queryBuilder.leftJoin('o.impPayment', 'p');
    queryBuilder.leftJoin('o.store', 's');
    queryBuilder.where('1 = 1');
    // 시작일, 종료일
    const { fromDate, toDate } = paymentSnapshotDashboardSearchDTO;
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
      queryBuilder.andWhere('ps.createdAt > :from', { from });
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
      queryBuilder.andWhere('ps.createdAt < :to', { to });
    }
    queryBuilder.groupBy('sumDate');
    //queryBuilder.orderBy('sumDate ASC');
    const paymentSnapshotDailySums = await queryBuilder.getRawMany();

    let totalAllPrice = 0;
    let totalPaidPrice = 0;
    let totalCancelledPrice = 0;
    let allCount = 0;
    let paidCount = 0;
    let cancelledCount = 0;
    const dailySums = [];
    for (let i = 0; i < paymentSnapshotDailySums.length; i++) {
      const paymentSnapshotDailySum = paymentSnapshotDailySums[i];
      const paymentSnapshotDailySumDTO = new PaymentSnapshotDailySumDTO();
      paymentSnapshotDailySumDTO.sumDate = paymentSnapshotDailySum.sumDate;
      paymentSnapshotDailySumDTO.dailyAllPrice = parseInt(
        paymentSnapshotDailySum.dailyAllPrice,
      );
      totalAllPrice += paymentSnapshotDailySumDTO.dailyAllPrice;

      paymentSnapshotDailySumDTO.dailyPaidPrice = parseInt(
        paymentSnapshotDailySum.dailyPaidPrice,
      );
      totalPaidPrice += paymentSnapshotDailySumDTO.dailyPaidPrice;

      paymentSnapshotDailySumDTO.dailyCancelledPrice = parseInt(
        paymentSnapshotDailySum.dailyCancelledPrice,
      );
      totalCancelledPrice += paymentSnapshotDailySumDTO.dailyCancelledPrice;

      paymentSnapshotDailySumDTO.dailyAllCount = parseInt(
        paymentSnapshotDailySum.dailyAllCount,
      );
      allCount += paymentSnapshotDailySumDTO.dailyAllCount;

      paymentSnapshotDailySumDTO.dailyPaidCount = parseInt(
        paymentSnapshotDailySum.dailyPaidCount,
      );
      paidCount += paymentSnapshotDailySumDTO.dailyPaidCount;

      paymentSnapshotDailySumDTO.dailyCancelledCount = parseInt(
        paymentSnapshotDailySum.dailyCancelledCount,
      );
      cancelledCount += paymentSnapshotDailySumDTO.dailyCancelledCount;
      dailySums[i] = paymentSnapshotDailySumDTO;
    }
    // 결제현황 대시보드 DTO
    const paymentSnapshotDashboardDTO = new PaymentSnapshotDashboardDTO();
    // 결제현황 통계 DTO 변환
    const paymentSnapshotStatisticsDTO = new PaymentSnapshotStatisticsDTO();
    paymentSnapshotStatisticsDTO.totalAllPrice = totalAllPrice;
    paymentSnapshotStatisticsDTO.totalPaidPrice = totalPaidPrice;
    paymentSnapshotStatisticsDTO.totalCancelledPrice = totalCancelledPrice;
    paymentSnapshotStatisticsDTO.allCount = allCount;
    paymentSnapshotStatisticsDTO.paidCount = paidCount;
    paymentSnapshotStatisticsDTO.cancelledCount = cancelledCount;
    paymentSnapshotDashboardDTO.statistics = paymentSnapshotStatisticsDTO;
    // 결제현황 일별 합계(차트) DTO 변환
    paymentSnapshotDashboardDTO.dailySums = dailySums;

    return paymentSnapshotDashboardDTO;
  }

  async getPaymentSnapshotStoreDashboard(
    storeId: number,
    paymentSnapshotDashboardSearchDTO: PaymentSnapshotDashboardSearchDTO,
  ): Promise<any> {
    const queryBuilder =
      this.paymentSnapshotsRepository.createQueryBuilder('ps');
    queryBuilder.select([
      'SUBSTRING(DATE_ADD(o.createdAt, INTERVAL 9 HOUR), 1, 10) AS sumDate',
      'SUM(o.purchasePrice) AS dailyAllPrice',
      "SUM(CASE WHEN ps.status = 'paid' THEN o.purchasePrice ELSE 0 END) AS dailyPaidPrice",
      "SUM(CASE WHEN ps.status = 'cancelled' THEN o.purchasePrice ELSE 0 END) AS dailyCancelledPrice",
      'COUNT(ps.id) AS dailyAllCount',
      "SUM(CASE WHEN ps.status = 'paid' THEN 1 ELSE 0 END) AS dailyPaidCount",
      "SUM(CASE WHEN ps.status = 'cancelled' THEN 1 ELSE 0 END) AS dailyCancelledCount",
    ]);
    queryBuilder.leftJoin('ps.order', 'o');
    queryBuilder.leftJoin('o.impPayment', 'p');
    queryBuilder.leftJoin('o.store', 's');
    // storeId 설정
    queryBuilder.where('o.storeId = :storeId', { storeId });
    // 시작일, 종료일
    const { fromDate, toDate } = paymentSnapshotDashboardSearchDTO;
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
      queryBuilder.andWhere('ps.createdAt > :from', { from });
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
      queryBuilder.andWhere('ps.createdAt < :to', { to });
    }
    queryBuilder.groupBy('sumDate');
    //queryBuilder.orderBy('sumDate ASC');
    const paymentSnapshotDailySums = await queryBuilder.getRawMany();

    let totalAllPrice = 0;
    let totalPaidPrice = 0;
    let totalCancelledPrice = 0;
    let allCount = 0;
    let paidCount = 0;
    let cancelledCount = 0;
    const dailySums = [];
    for (let i = 0; i < paymentSnapshotDailySums.length; i++) {
      const paymentSnapshotDailySum = paymentSnapshotDailySums[i];
      const paymentSnapshotDailySumDTO = new PaymentSnapshotDailySumDTO();
      paymentSnapshotDailySumDTO.sumDate = paymentSnapshotDailySum.sumDate;
      paymentSnapshotDailySumDTO.dailyAllPrice = parseInt(
        paymentSnapshotDailySum.dailyAllPrice,
      );
      totalAllPrice += paymentSnapshotDailySumDTO.dailyAllPrice;

      paymentSnapshotDailySumDTO.dailyPaidPrice = parseInt(
        paymentSnapshotDailySum.dailyPaidPrice,
      );
      totalPaidPrice += paymentSnapshotDailySumDTO.dailyPaidPrice;

      paymentSnapshotDailySumDTO.dailyCancelledPrice = parseInt(
        paymentSnapshotDailySum.dailyCancelledPrice,
      );
      totalCancelledPrice += paymentSnapshotDailySumDTO.dailyCancelledPrice;

      paymentSnapshotDailySumDTO.dailyAllCount = parseInt(
        paymentSnapshotDailySum.dailyAllCount,
      );
      allCount += paymentSnapshotDailySumDTO.dailyAllCount;

      paymentSnapshotDailySumDTO.dailyPaidCount = parseInt(
        paymentSnapshotDailySum.dailyPaidCount,
      );
      paidCount += paymentSnapshotDailySumDTO.dailyPaidCount;

      paymentSnapshotDailySumDTO.dailyCancelledCount = parseInt(
        paymentSnapshotDailySum.dailyCancelledCount,
      );
      cancelledCount += paymentSnapshotDailySumDTO.dailyCancelledCount;
      dailySums[i] = paymentSnapshotDailySumDTO;
    }
    // 결제현황 대시보드 DTO
    const paymentSnapshotDashboardDTO = new PaymentSnapshotDashboardDTO();
    // 결제현황 통계 DTO 변환
    const paymentSnapshotStatisticsDTO = new PaymentSnapshotStatisticsDTO();
    paymentSnapshotStatisticsDTO.totalAllPrice = totalAllPrice;
    paymentSnapshotStatisticsDTO.totalPaidPrice = totalPaidPrice;
    paymentSnapshotStatisticsDTO.totalCancelledPrice = totalCancelledPrice;
    paymentSnapshotStatisticsDTO.allCount = allCount;
    paymentSnapshotStatisticsDTO.paidCount = paidCount;
    paymentSnapshotStatisticsDTO.cancelledCount = cancelledCount;
    paymentSnapshotDashboardDTO.statistics = paymentSnapshotStatisticsDTO;
    // 결제현황 일별 합계(차트) DTO 변환
    paymentSnapshotDashboardDTO.dailySums = dailySums;

    return paymentSnapshotDashboardDTO;
  }

  async getValidatedPaymentSnapshotById(
    id: number,
  ): Promise<PaymentSnapshotDTO> {
    const paymentSnapshot: PaymentSnapshotDTO =
      await this.paymentSnapshotsRepository.findOne({
        id,
      });
    if (!paymentSnapshot) {
      throw new NotFoundException(`등록되지 않은 결재현황입니다.( id: ${id} )`);
    }

    return paymentSnapshot;
  }
}
