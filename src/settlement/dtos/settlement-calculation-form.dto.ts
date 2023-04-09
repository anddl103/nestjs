import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { SettlementStatus } from 'src/common/enums/settlement-status';

export class SettlementCalculationFormDTO {
  @ApiProperty({
    example: '2022-07',
    description: '결제월',
    required: true,
  })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'yyyy-MM 으로 입력해주십시오.',
  })
  paymentDate: string;

  @ApiProperty({
    enum: [SettlementStatus.Ready, SettlementStatus.Done],
    example: SettlementStatus.Ready,
    description:
      '정산상태[ready: 대기, done: 완료], 지정을 안할 경우 디폴트 ready, done의 경우 doneAt 은 createdAt + 7일',
    required: false,
  })
  @IsOptional()
  @IsEnum(SettlementStatus)
  status: SettlementStatus;
}
