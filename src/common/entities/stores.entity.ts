import { CommonEntity } from './common.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryStoreEntity } from './category-stores.entity';
import { MenuGroupEntity } from './menu-groups.entity';
import { MenuSignatureEntity } from './menu-signatures.entity';
import { BookmarkEntity } from './bookmarks.entity';
import { OwnerEntity } from './owners.entity';
import { TrayEntity } from './trays.entity';
import { StoreImageEntity } from './store-images.entity';
import { StoreOpenHourEntity } from './store-open-hours.entity';
import { StoreBreakHourEntity } from './store-break-hours.entity';
import { StoreStopHourEntity } from './store-stop-hours.entity';
import { OrderEntity } from './orders.entity';
import { SettlementSumEntity } from './settlement-sums.entity';
import { StorePayTypeEntity } from './store-pay-type.entity';

@Entity({
  name: 'store',
})
export class StoreEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '사장님 아이디',
  })
  @Column({ type: 'int', nullable: false })
  ownerId: number;

  @ApiProperty({
    example: '한식',
    description: '업종(한식|양식|중식|일식|치킨|야식|패스트푸드)',
  })
  @Column({ type: 'varchar', nullable: false })
  category: string;

  @ApiProperty({
    example: '바른치킨 공덕파크자이점',
    description: '가게명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: '080-1111-1234',
    description: '전화번호',
  })
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @ApiProperty({
    example: 12000,
    description: '최소 주문 금액',
  })
  @Column({ type: 'int', nullable: true })
  minOrderPrice: number;

  @ApiProperty({
    example: 5000,
    description: '기본 배달비',
  })
  @Column({ type: 'int', nullable: true })
  deliveryPrice: number;

  @ApiProperty({
    example: '상동, 중동, 하동',
    description: '배달지역',
  })
  @Column({ type: 'varchar', nullable: true })
  deliveryArea: string;

  @ApiProperty({
    example: 'CESCO 해충방제 점검일 2022.01',
    description: '위생정보',
  })
  @Column({ type: 'varchar', nullable: true })
  hygiene: string;

  @ApiProperty({
    example: '기타 가게 안내 사항을 입력해주세요.',
    description: '기타 안내',
  })
  @Column({ type: 'varchar', nullable: true })
  instruction: string;

  @ApiProperty({
    example: '오늘 당신의 치킨은 몇번째 튀긴 치킨인가요?',
    description: '가게소개',
  })
  @Column({ type: 'varchar', nullable: true })
  intro: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '커버 이미지1 URL( 가게 이미지1 )',
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage1: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '커버 이미지2 URL( 대표메뉴 이미지1 )',
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage2: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '커버 이미지3 URL( 대표메뉴 이미지2 )',
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage3: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '커버 이미지4 URL( 대표메뉴 이미지3 )',
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage4: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '커버 이미지5 URL( 대표메뉴 이미지4 )',
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage5: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '커버 이미지6 URL( 대표메뉴 이미지5 )',
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage6: string;

  @ApiProperty({
    example: true,
    description: '포장유무',
  })
  @Column({ type: 'boolean', nullable: true })
  isPackage: boolean;

  @ApiProperty({
    example: '서울 마포구 공덕동 456 롯데캐슬 프레지던트',
    description: '가게 기본주소',
  })
  @Column({ type: 'varchar', nullable: true })
  address1: string;

  @ApiProperty({
    example: '지하 1층 102호',
    description: '가게 상세주소',
  })
  @Column({ type: 'varchar', nullable: true })
  address2: string;

  @ApiProperty({
    example:
      '돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',
    description: '원산지',
  })
  @Column({ type: 'varchar', nullable: true })
  origin: string;

  @ApiProperty({
    example: 'close',
    description: '영업상황(준비-ready|시작-open|중지-stop|종료-close)',
  })
  @Column({ type: 'varchar', nullable: true })
  openStatus: string;

  @ApiProperty({
    example: 'allweek',
    description:
      '영업시간설정 구분(평일주말동일-allweek|평일주말구분-weekday|요일별구분-dayofweek)',
  })
  @Column({ type: 'varchar', nullable: true })
  openSettingsType: string;

  @ApiProperty({
    example: true,
    description: '휴게시간 유무',
  })
  @Column({ type: 'boolean', nullable: true })
  isBreakHours: boolean;

  @ApiProperty({
    example: true,
    description: '휴무일 유무',
  })
  @Column({ type: 'boolean', nullable: true })
  isRestDays: boolean;

  @ApiProperty({
    example: '매일 11:30 - 22:00',
    description: '영업시간',
  })
  @Column({ type: 'varchar', nullable: true })
  openHours: string;

  @ApiProperty({
    example: '15:00 - 17:00',
    description: '준비시간',
  })
  @Column({ type: 'varchar', nullable: true })
  breakHours: string;

  @ApiProperty({
    example: '연중무휴',
    description: '휴무일',
  })
  @Column({ type: 'varchar', nullable: true })
  restDays: string;

  @ApiProperty({
    example: 20,
    description: '조리시간(분)',
  })
  @Column({ type: 'int', nullable: true })
  cookingTime: number;

  @ApiProperty({
    example: 'POS',
    description: '주문 전달/취소 대상(포스-POS, 푸드넷24-FOODNET24)',
  })
  @Column({ type: 'varchar', nullable: true })
  relayTo: string;

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

  @ManyToOne(() => OwnerEntity, (owner) => owner.stores)
  owner: OwnerEntity;

  @OneToMany(() => StoreImageEntity, (storeImage) => storeImage.store)
  storeImages: StoreImageEntity[];

  @OneToMany(() => CategoryStoreEntity, (categoryStore) => categoryStore.store)
  categoryStores: CategoryStoreEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.store)
  bookmarks: BookmarkEntity[];

  @OneToMany(() => MenuGroupEntity, (menuGroup) => menuGroup.store)
  menuGroups: MenuGroupEntity[];

  @OneToMany(() => MenuSignatureEntity, (menuSignature) => menuSignature.store)
  menuSignatures: MenuSignatureEntity[];

  @OneToMany(() => TrayEntity, (tray) => tray.store)
  trays: TrayEntity[];

  @OneToMany(() => StoreOpenHourEntity, (storeOpenHour) => storeOpenHour.store)
  storeOpenHours: StoreOpenHourEntity[];

  @OneToOne(
    () => StoreBreakHourEntity,
    (storeBreakHour) => storeBreakHour.store,
  )
  storeBreakHour: StoreBreakHourEntity;

  @OneToOne(() => StoreStopHourEntity, (storeStopHour) => storeStopHour.store)
  storeStopHour: StoreStopHourEntity;

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];
}
