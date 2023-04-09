import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentSnapshotStatus } from '../../common/enums/payment-snapshot-status';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';
import { IsOnlyDate } from '../../common/decorators/dngg-date.decorator';
import { PayMethodType } from 'src/common/enums/pay-method-type';

export class PaymentSnapshotSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '',
    description: '검색어 입력(대상: 주문번호, 매장명)',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({
    enum: [PaymentSnapshotStatus.Paid, PaymentSnapshotStatus.Cancelled],
    example: PaymentSnapshotStatus.Paid,
    description:
      '구분(paid:결제완료, cancelled:결제취소)<br>status 값이 없을 경우 전체',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentSnapshotStatus)
  status: PaymentSnapshotStatus;

  @ApiProperty({
    example: false,
    description:
      '결제취소 여부(status > paid 결제완료에만 적용)<br>isCancelled 값이 없을 경우 결제(전체)<br>true 일 경우 결제(완료)<br>false 경우 결제(취소)',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isCancelled: string;

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

  @ApiProperty({
    example: '2022-05-01',
    description: '조회기간(fromDate)',
    required: true,
  })
  @IsOnlyDate()
  fromDate: string;

  @ApiProperty({
    example: '2022-06-31',
    description: '조회기간(toDate)',
    required: true,
  })
  @IsOnlyDate()
  toDate: string;
}
