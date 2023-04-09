import { PickType } from '@nestjs/swagger';
import { StoreStopHourEntity } from '../../common/entities/store-stop-hours.entity';

export class StoreStopHourDTO extends PickType(StoreStopHourEntity, [
  'id',
  'isNotSettings',
  'message',
  'startHour',
  'startMin',
  'endHour',
  'endMin',
] as const) {}
