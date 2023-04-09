import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { PaymentSnapshotStatus } from '../../common/enums/payment-snapshot-status';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';
import { PayMethodType } from '../../common/enums/pay-method-type';

export class SettlementDetailSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: 6,
    description: '정산합계 아이디',
    required: true,
  })
  @IsNumberString()
  id: number;

  @ApiProperty({
    enum: [PaymentSnapshotStatus.Paid, PaymentSnapshotStatus.Cancelled],
    example: PaymentSnapshotStatus.Paid,
    description:
      '결제상태(paid:결제완료, cancelled:결제취소)<br>status 값이 없을 경우 전체',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentSnapshotStatus)
  status: PaymentSnapshotStatus;

  @ApiProperty({
    enum: [
      PayMethodType.Samsung,
      PayMethodType.Card,
      PayMethodType.Trans,
      PayMethodType.Vbank,
      PayMethodType.Phone,
      PayMethodType.Cultureland,
      PayMethodType.Smartculture,
      PayMethodType.Booknlife,
      PayMethodType.Happymoney,
      PayMethodType.Point,
      PayMethodType.Ssgpay,
      PayMethodType.Lpay,
      PayMethodType.Payco,
      PayMethodType.Kakaopay,
      PayMethodType.Tosspay,
      PayMethodType.Naverpay,
    ],
    example: PayMethodType.Card,
    description:
      '결제수단[samsung: 삼성페이, card: 신용카드, trans: 계좌이체, vbank: 가상계좌, phone: 휴대폰, cultureland: 문화상품권,<br>smartculture: 스마트문상, booknlife: 도서문화상품권, happymoney: 해피머니, point: 포인트, ssgpay: SSGPAY,<br>lpay: LPAY, payco: 페이코, kakaopay: 카카오페이, tosspay: 토스, naverpay: 네이버페이]<br>payMethod 값이 없을 경우 전체',
    required: false,
  })
  @IsOptional()
  @IsEnum(PayMethodType)
  payMethod: PayMethodType;
}
