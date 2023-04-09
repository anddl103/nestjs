import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { StoreEntity } from '../../common/entities/stores.entity';
import { StoreBreakHourDTO } from './store-break-hour.dto';
import { StoreOpenHourDTO } from './store-open-hour.dto';

export class StoreOpenHourDetailDTO extends PickType(StoreEntity, [
  'id',
  'openStatus',
  'openSettingsType',
  'isBreakHours',
  'openHours',
  'breakHours',
  'restDays',
] as const) {
  @ApiProperty({
    example: [
      {
        dayOfWeek: 'monday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 30,
        closeHour: 22,
        closeMin: 30,
      },
      {
        dayOfWeek: 'tuesday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 20,
        closeHour: 21,
        closeMin: 40,
      },
      {
        dayOfWeek: 'wednesday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 40,
        closeHour: 22,
        closeMin: 50,
      },
      {
        dayOfWeek: 'thursday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 10,
        closeHour: 21,
        closeMin: 50,
      },
      {
        dayOfWeek: 'friday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 25,
        closeHour: 22,
        closeMin: 35,
      },
      {
        dayOfWeek: 'saturday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 11,
        closeHour: 22,
        closeMin: 22,
      },
      {
        dayOfWeek: 'sunday',
        isAllHours: false,
        isRestDay: false,
        openHour: 10,
        openMin: 30,
        closeHour: 22,
        closeMin: 30,
      },
    ],
    description: '영업시간 리스트( 7개 )',
  })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => StoreOpenHourDTO)
  storeOpenHours: StoreOpenHourDTO[];

  @ApiProperty({
    example: {
      startHour: 15,
      startMin: 0,
      endHour: 17,
      endMin: 0,
    },
    description: '휴게시간',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => StoreBreakHourDTO)
  storeBreakHour: StoreBreakHourDTO;
}
