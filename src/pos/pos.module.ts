import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { PosBannerEntity } from '../common/entities/pos-banners.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PosBannerEntity])],
  controllers: [PosController],
  providers: [PosService],
})
export class PosModule {}
