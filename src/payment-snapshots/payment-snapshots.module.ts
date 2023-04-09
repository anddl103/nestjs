import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';
import { PaymentSnapshotsController } from './payment-snapshots.controller';
import { PaymentSnapshotsService } from './payment-snapshots.service';
import { CouponEntity } from '../common/entities/coupons.entity';
import { CouponDownloadEntity } from '../common/entities/coupon-download.entity';
import { PaymentSnapshotEntity } from '../common/entities/payment-snapshots.entity';
import { OrderEntity } from '../common/entities/orders.entity';
import { OrderMenuEntity } from '../common/entities/order-menus.entity';
import { OrderMenuPriceEntity } from '../common/entities/order-menu-prices.entity';
import { IamportPaymentEntity } from '../common/entities/iamport-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CouponEntity,
      CouponDownloadEntity,
      PaymentSnapshotEntity,
      OrderEntity,
      OrderMenuEntity,
      OrderMenuPriceEntity,
      IamportPaymentEntity,
    ]),
    PaymentModule,
  ],
  controllers: [PaymentSnapshotsController],
  providers: [PaymentSnapshotsService],
  exports: [PaymentSnapshotsService],
})
export class PaymentSnapshotsModule {}
