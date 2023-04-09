import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsOnlyDate } from '../../common/decorators/dngg-date.decorator';

export class PaymentSnapshotDashboardSearchDTO {
  @ApiProperty({
    example: '2022-09-01',
    description: '조회기간(fromDate)',
    required: false,
  })
  @IsOptional()
  @IsOnlyDate()
  fromDate: string;

  @ApiProperty({
    example: '2022-09-30',
    description: '조회기간(toDate)',
    required: false,
  })
  @IsOptional()
  @IsOnlyDate()
  toDate: string;
}
