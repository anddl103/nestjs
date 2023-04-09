import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../stores/stores.module';
import { MenuGroupsModule } from '../menu-groups/menu-groups.module';
import { OptionGroupsModule } from '../option-groups/option-groups.module';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MenuGroupEntity } from '../common/entities/menu-groups.entity';
import { MenuEntity } from '../common/entities/menus.entity';
import { MenuImageEntity } from '../common/entities/menu-images.entity';
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
import { ImageFileEntity } from '../common/entities/image-files.entity';

@Module({
  imports: [
    StoresModule,
    MenuGroupsModule,
    OptionGroupsModule,
    TypeOrmModule.forFeature([
      MenuGroupEntity,
      MenuEntity,
      MenuImageEntity,
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
      ImageFileEntity,
    ]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
