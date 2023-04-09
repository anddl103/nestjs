import { Column, Entity, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { MenuGroupEntity } from './menu-groups.entity';
import { MenuSignatureEntity } from './menu-signatures.entity';
import { MenuPriceEntity } from './menu-prices.entity';
import { MenuOptionGroupEntity } from './menu-opton-groups.entity';
import { RecommendCategoryMenuEntity } from './recommend-category-menus.entity';
import { DiscountCategoryMenuEntity } from './discount-category-menus.entity';
import { MenuImageEntity } from './menu-images.entity';

@Entity({
  name: 'menu',
})
export class MenuEntity extends CommonEntity {
  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  storeId: number;

  @ApiProperty({
    example: 1,
    description: '메뉴그룹 아이디',
  })
  @Column({ type: 'int', nullable: false })
  menuGroupId: number;

  @ApiProperty({
    example: '치킨메뉴',
    description: '메뉴그룹명',
  })
  @Column({ type: 'varchar', nullable: true })
  menuGroupName: string;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg',
    description: '메뉴이미지 URL',
  })
  @Column({ type: 'varchar', nullable: true })
  menuImage: string;

  @ApiProperty({
    example: '양념치킨',
    description: '메뉴명',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: '현미바사삭 순살 + 바른 치즈 떡볶이',
    description: '세트구성',
  })
  @Column({ type: 'varchar', nullable: true })
  combo: string;

  @ApiProperty({
    example: '배달 주문시, 주류메뉴는 다른 메뉴와 함께 구매해주세요',
    description: '메뉴그룹 설명',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    example: false,
    description: '대표메뉴 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isSignature: boolean;

  @ApiProperty({
    example: false,
    description: '인기메뉴 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isPopular: boolean;

  @ApiProperty({
    example: false,
    description: '기부메뉴 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isDonation: boolean;

  @ApiProperty({
    example: false,
    description: '품절 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isSoldout: boolean;

  @ApiProperty({
    example: false,
    description: '숨김 여부',
  })
  @Column({ type: 'boolean', nullable: true })
  isHidden: boolean;

  @ApiProperty({
    example: 1,
    description: '필수옵션수',
  })
  @Column({ type: 'int', nullable: true })
  requiredOption: number;

  @ApiProperty({
    example: 16900,
    description: '기본가격',
  })
  @Column({ type: 'int', nullable: true })
  basePrice: number;

  @ApiProperty({
    example: 1,
    description: '선택옵션수',
  })
  @Column({ type: 'int', nullable: true })
  optionalOption: number;

  @ApiProperty({
    example: 1,
    description: '노출순서',
  })
  @Column({ type: 'int', nullable: false })
  position: number;

  @ManyToOne(() => MenuGroupEntity, (menuGroup) => menuGroup.menus)
  menuGroup: MenuGroupEntity;

  @OneToOne(() => MenuSignatureEntity, (menuSignature) => menuSignature.menu)
  menuSignature: MenuSignatureEntity;

  @OneToMany(() => MenuPriceEntity, (menuPrice) => menuPrice.menu)
  menuPrices: MenuPriceEntity[];

  @OneToMany(() => MenuImageEntity, (menuImage) => menuImage.menu)
  menuImages: MenuImageEntity[];

  @OneToMany(
    () => MenuOptionGroupEntity,
    (menuOptionGroup) => menuOptionGroup.menu,
  )
  menuOptionGroups: MenuOptionGroupEntity[];

  @OneToOne(
    () => RecommendCategoryMenuEntity,
    (recommendCategoryMenu) => recommendCategoryMenu.menu,
  )
  recommendCategoryMenu: RecommendCategoryMenuEntity;

  @OneToOne(
    () => DiscountCategoryMenuEntity,
    (discountCategoryMenu) => discountCategoryMenu.menu,
  )
  discountCategoryMenu: DiscountCategoryMenuEntity;
}
