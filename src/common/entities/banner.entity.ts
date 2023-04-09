import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BannerType } from '../enums/banner-type';
import { CommonEntity } from './common.entity';

@Entity({
  name: 'banner',
})
export class BannerEntity extends CommonEntity {
  @ApiProperty({
    example: '오픈 기념 3000원 할인권',
    description: '배너명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

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
    enum: [
      BannerType.BannerMain,
      BannerType.PopupButtom,
      BannerType.PopupModal,
    ],
    example: BannerType.PopupModal,
    description: '분류(bannerMain, popupModal(중앙), popupButtom)',
    required: true,
  })
  @IsEnum(BannerType)
  @Column({ type: 'varchar', nullable: false })
  type: BannerType;

  @ApiProperty({
    example: false,
    description: '비활성 여부',
  })
  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;

  @ApiProperty({
    example: '설명',
    description: '설명',
  })
  @Column({ type: 'varchar', nullable: false })
  description: string;

  @ApiProperty({
    example: 'url',
    description: '이미지 url 주소',
  })
  @Column({ type: 'varchar', nullable: false })
  url: string;

  @ApiProperty({
    example: 'http://',
    description: 'event, notice, http',
  })
  @Column({ type: 'varchar', nullable: false })
  link: string;

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
}
