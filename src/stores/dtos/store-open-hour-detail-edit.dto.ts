import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { OpenSettingsType } from 'src/common/enums/open-settings-type';
import { StoreBreakHourEditDTO } from './store-break-hour-edit.dto';
import { StoreOpenHourEditDTO } from './store-open-hour-edit.dto';

export class StoreOpenHourDetailEditDTO {
  @ApiProperty({
    enum: [
      OpenSettingsType.AllWeek,
      OpenSettingsType.Weekday,
      OpenSettingsType.DayOfWeek,
    ],
    example: OpenSettingsType.AllWeek,
    description:
      '영업시간설정 구분(평일주말동일-allWeek|평일주말구분-weekday|요일별구분-dayOfWeek)',
  })
  @IsEnum(OpenSettingsType)
  openSettingsType: OpenSettingsType;

  @ApiProperty({
    example: true,
    description: '휴게시간 유무',
  })
  @IsBoolean()
  isBreakHours: boolean;

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
    required: true,
  })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => StoreOpenHourEditDTO)
  storeOpenHours: StoreOpenHourEditDTO[];

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
  @Type(() => StoreBreakHourEditDTO)
  storeBreakHour: StoreBreakHourEditDTO;
}
