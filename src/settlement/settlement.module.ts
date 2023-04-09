import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSnapshotsModule } from '../payment-snapshots/payment-snapshots.module';
import { StoresModule } from '../stores/stores.module';
import { OwnersModule } from '../owners/owners.module';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { SettlementEntity } from '../common/entities/settlements.entity';
import { SettlementFeeEntity } from '../common/entities/settlement-fees.entity';
import { SettlementSumEntity } from '../common/entities/settlement-sums.entity';
import { SettlementSumSnapshotEntity } from '../common/entities/settlement-sum-snapshots.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SettlementEntity,
      SettlementFeeEntity,
      SettlementSumEntity,
      SettlementSumSnapshotEntity,
    ]),
    PaymentSnapshotsModule,
    StoresModule,
    OwnersModule,
  ],
  controllers: [SettlementController],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
