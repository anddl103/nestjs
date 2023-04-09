import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { StoreEntity } from '../common/entities/stores.entity';
import { StoreOpenHourEntity } from '../common/entities/store-open-hours.entity';
import { StoreBreakHourEntity } from '../common/entities/store-break-hours.entity';
import { StoreStopHourEntity } from '../common/entities/store-stop-hours.entity';
import { StoreImageEntity } from '../common/entities/store-images.entity';
import { BookmarkEntity } from '../common/entities/bookmarks.entity';
import { CategoryStoreEntity } from '../common/entities/category-stores.entity';
import { MenuGroupEntity } from '../common/entities/menu-groups.entity';
import { MenuEntity } from '../common/entities/menus.entity';
import { MenuPriceEntity } from '../common/entities/menu-prices.entity';
import { MenuSignatureEntity } from '../common/entities/menu-signatures.entity';
import { MenuOptionGroupEntity } from '../common/entities/menu-opton-groups.entity';
import { OptionGroupEntity } from '../common/entities/option-groups.entity';
import { OptionEntity } from '../common/entities/options.entity';
import { TrayEntity } from '../common/entities/trays.entity';
import { TrayOptionEntity } from '../common/entities/tray-options.entity';
import { TrayOptionGroupEntity } from '../common/entities/tray-option-groups.entity';
import { RecommendCategoryEntity } from '../common/entities/recommend-categories.entity';
import { RecommendCategoryAreaEntity } from '../common/entities/recommend-category-areas.entity';
import { DiscountCategoryMenuEntity } from '../common/entities/discount-category-menus.entity';
import { OwnerEntity } from '../common/entities/owners.entity';
import { OwnerImageEntity } from '../common/entities/owner-images.entity';
import { ImageFileEntity } from '../common/entities/image-files.entity';
import { StorePayTypeEntity } from 'src/common/entities/store-pay-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      StoreOpenHourEntity,
      StoreBreakHourEntity,
      StoreStopHourEntity,
      StoreImageEntity,
      BookmarkEntity,
      CategoryStoreEntity,
      MenuGroupEntity,
      MenuEntity,
      MenuPriceEntity,
      MenuSignatureEntity,
      MenuOptionGroupEntity,
      OptionGroupEntity,
      OptionEntity,
      TrayEntity,
      TrayOptionEntity,
      TrayOptionGroupEntity,
      RecommendCategoryEntity,
      RecommendCategoryAreaEntity,
      DiscountCategoryMenuEntity,
      OwnerEntity,
      OwnerImageEntity,
      ImageFileEntity,
      StorePayTypeEntity,
    ]),
    CategoriesModule,
  ],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
