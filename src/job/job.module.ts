import { PushModule } from './../push/push.module';
import { OrderEntity } from 'src/common/entities/orders.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementModule } from '../settlement/settlement.module';
import { PushHistoryEntity } from '../common/entities/push-history.entity';
import { PushSendQueueEntity } from '../common/entities/push-send_queue.entity';
import { JobService } from './job.service';
import { HttpModule } from '@nestjs/axios';
import { PaymentSnapshotEntity } from 'src/common/entities/payment-snapshots.entity';
import { OrderSnapshotEntity } from 'src/common/entities/order-snapshots.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PushHistoryEntity,
      PushSendQueueEntity,
      OrderEntity,
      PaymentSnapshotEntity,
      OrderSnapshotEntity,
    ]),
    SettlementModule,
    HttpModule,
    PushModule,
  ],
  providers: [JobService],
})
export class JobModule {}
