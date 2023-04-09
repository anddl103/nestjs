import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceDTO {
  @ApiProperty({
    type: 'string',
    description: '현재 버전 (x.y.z)',
  })
  version: string;

  @ApiProperty({
    type: () => Boolean,
    description: '업데이트 강제 여부',
    default: false,
  })
  forced: boolean;

  @ApiProperty({
    type: 'string',
    description: '최소 동작 버전 (x.y.z)',
  })
  minVersion: string;

  @ApiProperty({
    type: () => Boolean,
    description: '서버 점검 예약 여부',
    default: false,
  })
  inspection: boolean;

  @ApiProperty({
    example: '2022-03-03 12:00:00',
    description: '점검 시작일',
  })
  start: Date;

  @ApiProperty({
    example: '2022-03-03 12:00:00',
    description: '점검 종료일',
  })
  end: Date;

  @ApiProperty({
    type: 'string',
    description: '메세지',
  })
  message: string;
}
