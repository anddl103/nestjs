import { PickType } from '@nestjs/swagger';
import { SettlementEntity } from '../../common/entities/settlements.entity';

export class SettlementStoreListDTO extends PickType(SettlementEntity, [
  'id',
  'expectedDate',
  'doneDate',
  'paymentSnapshotId',
  'paymentSnapshotDate',
  'paymentSnapshotStatus',
  'orderNumber',
  'salesPrice',
  'orderPrice',
  'userDeliveryPrice',
  'paymentPrice',
  'voucherPrice',
  'settlementPrice',
  'deductionPrice',
  'ownerDeliveryPrice',
  'discountPrice',
  'agencyPrice',
  'billingPrice',
  'pointPrice',
  'ownerCouponPrice',
  'dnggCouponPrice',
  'vatPrice',
  'status',
] as const) {}
