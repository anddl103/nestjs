import { PickType } from '@nestjs/swagger';
import { SettlementSumEntity } from '../../common/entities/settlement-sums.entity';

export class SettlementSumListDTO extends PickType(SettlementSumEntity, [
  'id',
  'createdAt',
  'createdDate',
  'expectedDate',
  'doneDate',
  'storeId',
  'storeName',
  'businessName',
  'businessNumber',
  'orderCount',
  'salesAmount',
  'paymentAmount',
  'settlementAmount',
  'deductionAmount',
  'dnggCouponAmount',
  'vatAmount',
  'status',
] as const) {}
