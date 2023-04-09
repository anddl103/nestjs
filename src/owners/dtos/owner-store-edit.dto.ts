import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerStatus } from '../../common/enums/owner-status';

export class OwnerStoreEditDTO {
  @ApiProperty({
    example: '회원 관련 내용을 기록하세요.',
    description: '메모',
  })
  @IsOptional()
  @IsString()
  memo: string;

  @ApiProperty({
    enum: OwnerStatus,
    example: 'confirm',
    description: '상태(요청-request|승인-confirm|반려-reject)',
  })
  @IsEnum(OwnerStatus)
  status: OwnerStatus;
}
