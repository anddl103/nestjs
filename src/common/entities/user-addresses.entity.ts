import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonEntity } from './common.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './users.entity';

@Entity({
  name: 'user_address',
})
export class UserAddressEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '사용자 내부 아이디',
  })
  @IsNumber()
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({
    example: '우리집',
    description: '주소지(우리집|회사|기타)',
  })
  @IsString()
  @IsNotEmpty({ message: '주소지(우리집|회사|기타)를 입력해 주세요.' })
  @Column({ type: 'varchar', nullable: false })
  area: string;

  @ApiProperty({
    example: 'road',
    description: '주소체계(지번-jibun|도로명-road)',
  })
  @IsString()
  @IsNotEmpty({ message: '주소체계(지번-jibun|도로명-road)를 선택해 주세요.' })
  @Column({ type: 'varchar', nullable: false })
  type: string;

  @ApiProperty({
    example: '서울특별시 마포구 백범로 31길 21',
    description: '기본주소',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  address1: string;

  @ApiProperty({
    example: '3층 302호',
    description: '상세주소',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  address2: string;

  @ApiProperty({
    example: '강원',
    description: '시도 단위',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  region1: string;

  @ApiProperty({
    example: '춘천시',
    description: '구 단위',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  region2: string;

  @ApiProperty({
    example: '후평동',
    description: '동 단위',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  region3: string;

  @ApiProperty({
    example: '후평1동',
    description: '행정동 명칭',
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  region4: string;

  @ApiProperty({
    example: 37.5453591,
    description: '위도',
  })
  @Column({ type: 'double', nullable: true })
  latitude: number;

  @ApiProperty({
    example: 126.9446182,
    description: '경도',
  })
  @Column({ type: 'double', nullable: true })
  longitude: number;

  @ApiProperty({
    example: false,
    description: '사용 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isUse: boolean;

  @ManyToOne(() => UserEntity, (user) => user.userAddresses)
  user: UserEntity;
}
