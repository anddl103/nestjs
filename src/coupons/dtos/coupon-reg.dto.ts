import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CouponType } from 'src/common/enums/coupon-type';

export class CouponRegisterDTO {
  @ApiProperty({
    example: '오픈 기념 3000원 할인권',
    description: '쿠폰명',
  })
  @IsNotEmpty({ message: '쿠폰명을 작성해주세요.' })
  name: string;

  // 오픈일자,
  @ApiProperty({
    example: '2022-03-03 12:00:00',
    description: '오픈일 시작일',
  })
  @Type(() => Date)
  @IsDate()
  openedAt: Date;

  @ApiProperty({
    example: '2022-03-03 12:00:00',
    description: '적용기간 - 시작일',
  })
  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @ApiProperty({
    example: '2022-03-07 12:00:00',
    description: '적용기간 - 종료일',
  })
  @Type(() => Date)
  @IsDate()
  endedAt: Date;

  @ApiProperty({
    example: false,
    description: '중복적용가능여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  isDuplicate: boolean;

  @ApiProperty({
    enum: CouponType,
    example: 'discount',
    description: '적용구분(할인: discount, 적립: accumulate)',
  })
  @IsString()
  @IsNotEmpty()
  benefit: CouponType;

  @ApiProperty({
    example: 10000,
    description: '최소이용 금액',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @ApiProperty({
    example: 10,
    description: '%할인율',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discountRate: number;

  @ApiProperty({
    example: 50000,
    description: '%할인 시 최대 금액',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxDiscountPrice: number;

  @ApiProperty({
    example: 15000,
    description: '할인 금액',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discountPrice: number;

  @ApiProperty({
    example: 300,
    description: '발급 수',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  issuedCount: number;

  @ApiProperty({
    example: 2,
    description: '인당 제한 수 설정 : (null : 제한없음, 숫자: 제한)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limitCount: number;

  readonly downloadCount: number = 0;

  readonly isDisabled: boolean = false;

  @ApiProperty({
    example: 1,
    description: '가게 아이디(점주 등록 시 필수)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  storeId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: '대상 아이디(공통코드 아이디)',
  })
  @IsNotEmpty()
  codeIds: number[];
}
