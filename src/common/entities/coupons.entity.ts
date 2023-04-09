import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { CouponDownloadEntity } from './coupon-download.entity';

@Entity({
  name: 'coupon',
})
export class CouponEntity extends CommonEntity {
  @ApiProperty({
    example: '오픈 기념 3000원 할인권',
    description: '쿠폰명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;
  // 오픈일자,
  @ApiProperty({
    example: '2022-03-03 12:00:00',
    description: '오픈일 시작일',
  })
  @Column({ type: 'timestamp', nullable: true })
  openedAt: Date;
  // 적용대상 대, 소

  @ApiProperty({
    example: '2022-03-03 12:00:00.000000',
    description: '사용기간 - 시작일',
  })
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @ApiProperty({
    example: '2022-03-07 12:00:00.000000',
    description: '사용기간 - 종료일',
  })
  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @ApiProperty({
    example: false,
    description: '중복적용가능여부',
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  isDuplicate: boolean;

  @ApiProperty({
    example: 'discount',
    description: '적용구분(할인: discount, 적립: accumulate)',
  })
  @Column({ type: 'varchar', nullable: true })
  benefit: string;

  @ApiProperty({
    example: 10000,
    description: '최소이용 금액',
  })
  @Column({ type: 'int', nullable: true })
  minPrice: number;

  @ApiProperty({
    example: 10,
    description: '%할인율',
  })
  @Column({ type: 'int', nullable: true })
  discountRate: number;

  @ApiProperty({
    example: 50000,
    description: '%할인 시 최대 금액',
  })
  @Column({ type: 'int', nullable: true })
  maxDiscountPrice: number;

  @ApiProperty({
    example: 15000,
    description: '할인 금액',
  })
  @Column({ type: 'int', nullable: true })
  discountPrice: number;

  @ApiProperty({
    example: 300,
    description: '발급 수',
  })
  @Column({ type: 'int', nullable: true })
  issuedCount: number;

  @ApiProperty({
    example: 2,
    description: '인당 제한 수 설정 : (null : 제한없음, 숫자: 제한)',
  })
  @Column({ type: 'int', nullable: true })
  limitCount: number;

  @ApiProperty({
    example: 300,
    description: '다운로드 수',
  })
  @Column({ type: 'int', nullable: true })
  downloadCount: number;

  @ApiProperty({
    example: false,
    description: '비활성 여부(발급중지여부)',
  })
  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;

  @ApiProperty({
    example: 1,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: true })
  storeId: number;

  @ApiProperty({
    example: '3',
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @ApiProperty({
    example: '3',
    description: '사용자 아이디',
  })
  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @OneToMany(
    () => CouponDownloadEntity,
    (couponDownload) => couponDownload.coupon,
  )
  couponDownload: CouponDownloadEntity[];
}
