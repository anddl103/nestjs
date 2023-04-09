import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../stores/stores.module';
import { OwnersController } from './owners.controller';
import { OwnersService } from './owners.service';
import { StoreEntity } from '../common/entities/stores.entity';
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
import { RecommendCategoryMenuEntity } from '../common/entities/recommend-category-menus.entity';
import { DiscountCategoryMenuEntity } from '../common/entities/discount-category-menus.entity';
import { OwnerEntity } from '../common/entities/owners.entity';
import { OwnerImageEntity } from '../common/entities/owner-images.entity';
import { ImageFileEntity } from '../common/entities/image-files.entity';
import { EventEntity } from '../common/entities/events.entity';
import { NoticeEntity } from '../common/entities/notices.entity';
import { QuestionEntity } from '../common/entities/questions.entity';

@Module({
  imports: [
    StoresModule,
    TypeOrmModule.forFeature([
      StoreEntity,
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
      RecommendCategoryMenuEntity,
      DiscountCategoryMenuEntity,
      OwnerEntity,
      OwnerImageEntity,
      ImageFileEntity,
      EventEntity,
      NoticeEntity,
      QuestionEntity,
    ]),
  ],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
