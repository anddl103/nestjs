import { PickType } from '@nestjs/swagger';
import { SettlementSumEntity } from '../../common/entities/settlement-sums.entity';

export class SettlementSumStoreDTO extends PickType(SettlementSumEntity, [
  'createdDate',
  'storeId',
  'storeName',
  'businessName',
] as const) {}
