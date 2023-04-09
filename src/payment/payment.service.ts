import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { IamportPaymentEntity } from '../common/entities/iamport-payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  private IMP_KEY: string;
  private IMP_SECRET: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(IamportPaymentEntity)
    private readonly iamportPaymentRepository: Repository<IamportPaymentEntity>,
  ) {
    this.IMP_KEY = this.configService.get('IMP_KEY');
    this.IMP_SECRET = this.configService.get('IMP_SECRET');
  }

  private async getToken() {
    const data = {
      imp_key: this.IMP_KEY, // REST API 키
      imp_secret: this.IMP_SECRET,
    };
    // 액세스 토큰(access token) 발급 받기
    const getToken = await lastValueFrom(
      this.httpService.post('/users/getToken', data),
    );

    if (!getToken || !getToken.data) {
      return null;
    }

    const { access_token } = getToken.data.response; // 인증 토큰

    return access_token;
  }

  /**
   * 결제 정보 검증
   * @param impUid 아임포트 고유 아이디
   */
  async validatePayment(impUid: string) {
    if (!impUid) {
      throw new NotFoundException(
        `해당 결제 아이디가 존재하지 않습니다, id: ${impUid}`,
      );
    }
    try {
      //토큰 가져오기
      const accessToken = await this.getToken();
      // imp_uid로 아임포트 서버에서 결제 정보 조회
      const headers = { Authorization: accessToken };
      const getPaymentData = await lastValueFrom(
        this.httpService.get(`/payments/${impUid}`, {
          headers,
        }),
      );

      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      return paymentData;
    } catch (error) {
      throw new BadRequestException(
        `결제 정보 검증이 실패하였습니다. id: ${impUid}`,
      );
    }
  }

  async cancelPayment(impUid: string, reason: string) {
    try {
      //토큰 가져오기
      const accessToken = await this.getToken();
      // imp_uid로 아임포트 서버에서 결제 정보 조회
      const headers = { Authorization: accessToken };
      const data = {
        imp_uid: impUid,
        reason,
        // refund_holder: '', //환불계좌 예금주(가상계좌취소시 필수)
        // refund_bank: '', //환불계좌 은행코드(하단 은행코드표 참조, 가상계좌취소시 필수)
        // refund_account: '', // 환불계좌 계좌번호(가상계좌취소시 필수)
        // refund_tel: '', // 환불계좌 예금주 연락처(가상계좌취소,스마트로 PG사 인경우 필수 )
      };
      const getPaymentData = await lastValueFrom(
        this.httpService.post(`/payments/cancel`, data, {
          headers,
        }),
      );

      const paymentData = getPaymentData.data.response; // 환물한 결제 정보
      return paymentData;
    } catch (error) {
      throw new BadRequestException(
        `결제 취소를 실패하였습니다. id: ${impUid}`,
      );
    }
  }

  async getIamportPaymentByOrderNumber(orderNumber: string) {
    const iamportPayment = await this.iamportPaymentRepository.findOne({
      merchantUid: orderNumber,
    });

    if (!iamportPayment) {
      throw new NotFoundException(
        `결제 정보가 없습니다. orderNumber: ${orderNumber}`,
      );
    }

    return iamportPayment;
  }
}
