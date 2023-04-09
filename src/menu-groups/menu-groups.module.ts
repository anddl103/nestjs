import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../stores/stores.module';
import { MenuGroupsController } from './menu-groups.controller';
import { MenuGroupsService } from './menu-groups.service';
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

@Module({
  imports: [
    StoresModule,
    TypeOrmModule.forFeature([
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
    ]),
  ],
  controllers: [MenuGroupsController],
  providers: [MenuGroupsService],
  exports: [MenuGroupsService],
})
export class MenuGroupsModule {}
