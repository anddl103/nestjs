import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CouponDisableDTO {
  @ApiProperty({
    example: true,
    description: '비활성 여부(긴급쿠폰발급중지여부)',
  })
  @IsBoolean()
  @IsNotEmpty()
  isDisabled: boolean;

  @ApiProperty({
    example: 1,
    description: '가게 아이디(매니저의 경우 생략 가능)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  storeId: number;
}
