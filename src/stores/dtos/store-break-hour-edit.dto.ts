import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class StoreBreakHourEditDTO {
  @ApiProperty({
    example: 15,
    description: '시작시간(시)',
  })
  @IsInt()
  @Min(0)
  @Max(23)
  startHour: number;

  @ApiProperty({
    example: 0,
    description: '시작시간(분)',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  startMin: number;

  @ApiProperty({
    example: 17,
    description: '종료시간(시)',
  })
  @IsInt()
  @Min(0)
  @Max(23)
  endHour: number;

  @ApiProperty({
    example: 0,
    description: '종료시간(분)',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  endMin: number;
}
