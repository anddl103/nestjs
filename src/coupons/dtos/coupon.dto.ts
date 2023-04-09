import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CouponEntity } from 'src/common/entities/coupons.entity';

export class CouponDTO extends PartialType(CouponEntity) {
  @ApiProperty({
    example: [1, 2, 3],
    description: '대상 아이디(공통코드 아이디)',
    required: false,
  })
  @IsOptional()
  codeIds: number[];
}
