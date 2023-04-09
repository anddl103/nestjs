import { CodesModule } from './../codes/codes.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponDisabledHistoryEntity } from 'src/common/entities/coupon-disabled-history.entity';
import { CouponTargetEntity } from 'src/common/entities/coupon-target.entity';
import { CouponEntity } from 'src/common/entities/coupons.entity';
import { StoresModule } from 'src/stores/stores.module';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [
    StoresModule,
    CodesModule,
    TypeOrmModule.forFeature([CouponEntity]),
    TypeOrmModule.forFeature([CouponDisabledHistoryEntity]),
    TypeOrmModule.forFeature([CouponTargetEntity]),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
