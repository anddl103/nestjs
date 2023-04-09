import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum } from 'class-validator';
import { SettlementStatus } from 'src/common/enums/settlement-status';

export class SettlementStatusFormDTO {
  @ApiProperty({
    example: [1, 2],
    description: '정산합계 아이디 리스트',
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'id 는 최소 1개 이상 선택해 주세요.' })
  ids: number[];

  @ApiProperty({
    enum: [SettlementStatus.Done, SettlementStatus.Pending],
    example: SettlementStatus.Done,
    description: '구분(done:정산완료, pending:정산보류)',
    required: true,
  })
  @IsEnum(SettlementStatus)
  status: SettlementStatus;
}
