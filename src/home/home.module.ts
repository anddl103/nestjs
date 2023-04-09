import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { RecommendCategoryEntity } from '../common/entities/recommend-categories.entity';
import { RecommendCategoryAreaEntity } from '../common/entities/recommend-category-areas.entity';
import { StoreEntity } from '../common/entities/stores.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecommendCategoryEntity,
      RecommendCategoryAreaEntity,
      StoreEntity,
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
