import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class PaymentSnapshotFormDTO {
  @ApiProperty({
    example: '고객 요청으로 인해 취소 처리합니다.',
    description: '주문 취소사유',
    required: true,
  })
  @MaxLength(250, { message: '취소사유는 250자 이하로 입력해주십시오.' })
  @IsNotEmpty({
    message: '취소사유(reason)를 입력해주십시오.',
  })
  reason: string;
}
