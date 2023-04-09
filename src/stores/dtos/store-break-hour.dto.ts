import { PickType } from '@nestjs/swagger';
import { StoreBreakHourEntity } from '../../common/entities/store-break-hours.entity';

export class StoreBreakHourDTO extends PickType(StoreBreakHourEntity, [
  'startHour',
  'startMin',
  'endHour',
  'endMin',
] as const) {}
