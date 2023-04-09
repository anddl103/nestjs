import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImpCertificationFormDTO {
  @ApiProperty({
    example: '010-1234-1234',
    description: '휴대폰 번호',
  })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    example: 'imp_123456789',
    description: '아임포트 인증번호',
  })
  @IsOptional()
  impUid: string;
}
