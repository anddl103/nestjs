import { ApiProperty } from '@nestjs/swagger';

export class SettlementStoreStatisticsDTO {
  @ApiProperty({
    example: 10000000,
    description: '정산완료금액',
  })
  totalSettlementPrice: number;
}
