import { PickType } from '@nestjs/swagger';
import { SettlementEntity } from '../../common/entities/settlements.entity';

export class SettlementListDTO extends PickType(SettlementEntity, [
  'id',
  'createdAt',
  'createdDate',
  'expectedDate',
  'doneDate',
  'paymentSnapshotId',
  'orderNumber',
  'paymentPrice',
  'settlementPrice',
  'salesPrice',
  'deductionPrice',
  'dnggCouponPrice',
  'vatPrice',
  'status',
  'isCancelled',
] as const) {}
