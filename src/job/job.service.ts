import { PaymentService } from './../payment/payment.service';
import { FcmService } from './../fcm/fcm.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PushHistoryEntity } from 'src/common/entities/push-history.entity';
import { PushSendQueueEntity } from 'src/common/entities/push-send_queue.entity';
import { getConnection, getManager, getRepository, Repository } from 'typeorm';
import { SettlementService } from '../settlement/settlement.service';
import { OrderEntity } from 'src/common/entities/orders.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PushService } from 'src/push/push.service';
import { PushSendUserRequestDTO } from 'src/push/dtos/push-send-user.req.dto';
import { PushSendNotificationDTO } from 'src/push/dtos/push-send-notification.dto';
import { lastValueFrom } from 'rxjs';
import { CouponDownloadEntity } from 'src/common/entities/coupon-download.entity';
import { PaymentSnapshotEntity } from 'src/common/entities/payment-snapshots.entity';
import { IamportPaymentCancelEntity } from 'src/common/entities/iamport-payment-cancel.entity';
import { IamportPaymentEntity } from 'src/common/entities/iamport-payment.entity';
import { OrderSnapshotEntity } from 'src/common/entities/order-snapshots.entity';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  private ORDER_API_BASE_URL: string;
  private ORDER_API_TOKEN: string;
  private readonly orderStatusPayment = 'payment';
  private readonly orderStatusCancel = 'cancel';

  constructor(
    @InjectRepository(PushHistoryEntity)
    private readonly pushHistoryRepository: Repository<PushHistoryEntity>,
    @InjectRepository(PushSendQueueEntity)
    private readonly pushSendQueueRepository: Repository<PushSendQueueEntity>,
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(PaymentSnapshotEntity)
    private readonly paymentSnapshotRepository: Repository<PaymentSnapshotEntity>,
    @InjectRepository(OrderSnapshotEntity)
    private readonly orderSnapshotRepository: Repository<OrderSnapshotEntity>,
    private readonly fcmService: FcmService,
    private readonly settlementService: SettlementService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly pushService: PushService,
    private readonly paymentService: PaymentService,
  ) {
    this.ORDER_API_BASE_URL = configService.get('ORDER_API_BASE_URL');
    this.ORDER_API_TOKEN = configService.get('ORDER_API_TOKEN');
  }

  // 일단 1분마다 체크로 푸쉬 체크로 설정
  @Interval(60000)
  async handleIntervalPushNotification() {
    // 서버가 여러대 좼을 때 redis를 이용 할지 그냥 db로 queue를 만들지 생각해야 함
    const sendList = await this.pushSendQueueRepository
      .createQueryBuilder('send')
      .select([
        'send.id',
        'send.deviceToken',
        'send.title',
        'send.body',
        'send.imageUrl',
      ])
      .where('send.retryCount <= :sid', {
        sid: 3,
      })
      .limit(120)
      .getMany();

    for (const val of sendList) {
      const token = val.deviceToken;
      const payload = {
        title: val.title,
        body: val.body,
        imageUrl: val.imageUrl ? val.imageUrl : undefined,
      };

      if (!token) {
        this.logger.debug('You provide an empty device ids list!', val.id);
      }

      const tokens = [token];

      try {
        // push 발송
        await this.fcmService.sendNotification(tokens, payload);

        // await this.pushSendQueueRepository.delete({ id: val.id });
      } catch (error) {
        val.retryCount++;
        val.status = 'failure';
        await this.pushHistoryRepository.save(val);
        this.logger.error(error.message, error.stackTrace, 'nestjs-fcm');
        throw error;
      }
    }
  }

  // 정산데이터 매일 새벽 3시 0분 10초에 생성(푸쉬알림 실행 후 10초 세팅)
  @Cron('10 0 18 * * *')
  async handleCronSettlementData() {
    // UTC 시간 기준이기 때문에 전일 18시로 세팅 (18 + 9 = 24 + 3)
    this.logger.debug('handle cron settlement data');
    // 정산실행일시 : UTC 기준 전일 18시, KST 기준 당일 3시로 설정
    const now = new Date();
    const targetDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
      0,
    );
    // 정산데이터 생성
    await this.settlementService.createSettlementDatasByDate(targetDate);
  }

  // 일단 1분마다 체크로 푸쉬 체크로 설정
  @Interval(60000)
  async handleIntervalOrderPaymentRequest() {
    // 서버가 여러대 좼을 때 redis를 이용 할지 그냥 db로 queue를 만들지 생각해야 함
    const orderList = await this.ordersRepository
      .createQueryBuilder('or')
      .select([
        'or.id',
        'or.storeId',
        'or.orderNumber',
        'or.orderStatus',
        'or.usingMethod',
      ])
      .where(
        'or.updatedAt between DATE_SUB(NOW(), INTERVAL 5 MINUTE) and DATE_SUB(NOW(), INTERVAL 1 MINUTE)',
      )
      .andWhere('or.orderStatus = :stu', {
        stu: this.orderStatusPayment,
      })
      .getMany();

    for (const val of orderList) {
      try {
        // order 주문
        await this.notificationOrder(
          val.storeId,
          val.orderNumber,
          val.usingMethod,
        );
      } catch (error) {
        this.logger.error('order payment request error');
        this.logger.error(error.message, error.stackTrace, 'order-new');
        throw error;
      }
    }

    // cancel list
    // 서버가 여러대 좼을 때 redis를 이용 할지 그냥 db로 queue를 만들지 생각해야 함
    const cancelList = await this.ordersRepository
      .createQueryBuilder('or')
      .select(['or.id', 'or.orderNumber', 'or.orderStatus', 'or.userId'])
      .where('or.updatedAt < DATE_SUB(NOW(), INTERVAL 5 MINUTE)')
      .andWhere('or.orderStatus = :stu', {
        stu: this.orderStatusPayment,
      })
      .getMany();

    let userIds = [];
    for (const val of cancelList) {
      // push 대상 선정
      userIds.push(val.userId);

      try {
        await this.updateOrderCancel(val.id, val.userId);
      } catch (error) {
        userIds = userIds.filter((e) => e !== val.userId);
        this.logger.error('order cancel error');
        this.logger.error(error.message, error.stackTrace, 'order');
        throw error;
      }
    }

    if (userIds.length > 0) {
      const pushSendUserRequestDTO = new PushSendUserRequestDTO();
      const notification = new PushSendNotificationDTO();
      notification.title = '취소';
      notification.body = '취소합니다';
      pushSendUserRequestDTO.notification = notification;
      pushSendUserRequestDTO.userIds = userIds;

      this.pushService.pushSendQueueUser(pushSendUserRequestDTO);
    }
  }

  /**
   * pos 주문 정보
   * @param storeId 가게 고유 아이디
   * @param orderNumber 주문 번호
   * @param receptionType 매장 타입
   */
  async notificationOrder(
    storeId: number,
    orderNumber: string,
    receptionType: string,
  ) {
    if (!storeId || !orderNumber || !receptionType) {
      this.logger.error(
        `해당 주문 정보가 존재하지 않습니다. ${storeId} ${orderNumber} ${receptionType}`,
        'order-notification',
      );
      return;
    }
    try {
      const headers = { token: this.ORDER_API_TOKEN };
      const data = {
        storeId,
        orderNumber,
        receptionType,
      };
      const getOrderData = await lastValueFrom(
        this.httpService.post(`${this.ORDER_API_BASE_URL}/order/new`, data, {
          headers,
        }),
      );

      const orderData = getOrderData.data.response; // pos 주문 정보
      return orderData;
    } catch (error) {
      this.logger.error(
        `pos 주문 등록을 실패하였습니다. orderNumber: ${orderNumber}`,
        'order-notification-fail',
      );
      throw error;
    }
  }

  /**
   * pos 주문 취소 호출
   * @param storeId 가게 고유 아이디
   * @param orderNumber 주문 번호
   */
  async cancelNotificationOrder(storeId: number, orderNumber: string) {
    try {
      const headers = { token: this.ORDER_API_TOKEN };
      const data = {
        storeId,
        orderNumber,
      };
      const getOrderData = await lastValueFrom(
        this.httpService.post(`${this.ORDER_API_BASE_URL}/order/cancel`, data, {
          headers,
        }),
      );

      const orderData = getOrderData.data.response;
      return orderData;
    } catch (error) {
      this.logger.error(
        `pos 주문 취소를 실패하였습니다. orderNumber: ${orderNumber}`,
        'order-notification-cancel-fail',
      );
      throw error;
    }
  }

  /**
   * 취소 처리
   * @param id
   * @param userId
   */
  async updateOrderCancel(id: number, userId: number) {
    // 결제 상태 및 주문 금액 확인
    const order = await this.ordersRepository.findOne({
      id,
      userId,
    });

    const payStatusCancelled = 'cancelled';
    let iamportPayment: any;
    let cancelHistory: any;
    let pay: any;
    const isPayType = order.payType == 1 ? true : false;
    if (isPayType) {
      iamportPayment = await this.paymentService.getIamportPaymentByOrderNumber(
        order.orderNumber,
      );

      // 결제 상태가 아닌 경우
      if (iamportPayment.status != 'paid') {
        throw new BadRequestException(
          `결제 상태가 아닙니다. payment status : ${iamportPayment.status}`,
        );
      }

      pay = await this.paymentService.cancelPayment(
        iamportPayment.impUid,
        '주문 미접수 취소',
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

      cancelHistory = pay.cancel_history;

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
    }

    await getManager().transaction(async (transactionalEntityManager) => {
      if (order.payType == 1) {
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
      }

      // 오더 상태 변경
      await this.updateOrderStatus(id, this.orderStatusCancel, userId);
      if (isPayType) {
        // payment snapshot 추가
        this.paymentSnapshotRepository.save({
          orderId: id,
          status: pay.status,
        });
      } else {
        this.orderSnapshotRepository.save({
          orderId: id,
          status: payStatusCancelled,
        });
      }

      if (order.couponPrice > 0) {
        const couponDownloadInfo = await getRepository(CouponDownloadEntity)
          .createQueryBuilder('cd')
          .where('cd.user_id = :uid', {
            uid: userId,
          })
          .andWhere('cd.order_id = :oid', { oid: id })
          .andWhere('is_use = true')
          .getOne();
        // 쿠폰 사용시 쿠폰 사용 처리
        await transactionalEntityManager
          .createQueryBuilder()
          .update(CouponDownloadEntity)
          .where({ id: couponDownloadInfo.id })
          .set({ isUse: false, orderId: null })
          .execute();
      }
    });

    // pos 호출하기
    await this.cancelNotificationOrder(order.storeId, order.orderNumber);
  }

  async updateOrderStatus(
    orderId: number,
    status: string,
    userId: number,
  ): Promise<void> {
    // TODO 개발 편의상 5개 상태 모두 수정 가능하도록 처리 추후 수정 필요 ( 이전 단계 체크 등 )
    console.log(`status = ${status}`);
    await getConnection()
      .createQueryBuilder()
      .update(OrderEntity)
      .set({ orderStatus: status, cancelCode: 95 })
      .where('order.id = :oid', {
        oid: orderId,
      })
      .andWhere('order.user_id = :uid', {
        uid: userId,
      })
      .execute();
  }
}
