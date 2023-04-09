import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, Max, Min } from 'class-validator';
import { DayOfWeek } from '../../common/enums/day-of-week';

export class StoreOpenHourEditDTO {
  @ApiProperty({
    enum: [
      DayOfWeek.Monday,
      DayOfWeek.Tuesday,
      DayOfWeek.Wednesday,
      DayOfWeek.Thursday,
      DayOfWeek.Friday,
      DayOfWeek.Saturday,
      DayOfWeek.Sunday,
    ],
    example: DayOfWeek.Monday,
    description:
      '요일(monday|tuesday|wednesday|thursday|friday|saturday|sunday)',
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    example: false,
    description: '24시간영업 유무',
  })
  @IsBoolean()
  isAllHours: boolean;

  @ApiProperty({
    example: false,
    description: '휴일 유무',
  })
  @IsBoolean()
  isRestDay: boolean;

  @ApiProperty({
    example: 10,
    description: '오픈시간(시)',
  })
  @IsInt()
  @Min(0)
  @Max(23)
  openHour: number;

  @ApiProperty({
    example: 30,
    description: '오픈시간(분)',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  openMin: number;

  @ApiProperty({
    example: 21,
    description: '마감시간(시)',
  })
  @IsInt()
  @Min(0)
  @Max(23)
  closeHour: number;

  @ApiProperty({
    example: 30,
    description: '마감시간(분)',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  closeMin: number;
}
