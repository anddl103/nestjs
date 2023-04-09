import { PickType } from '@nestjs/swagger';
import { StoreOpenHourEntity } from '../../common/entities/store-open-hours.entity';

export class StoreOpenHourDTO extends PickType(StoreOpenHourEntity, [
  'dayOfWeek',
  'isAllHours',
  'isRestDay',
  'openHour',
  'openMin',
  'closeHour',
  'closeMin',
] as const) {}
