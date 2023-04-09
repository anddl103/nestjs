import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushSendQueueEntity } from 'src/common/entities/push-send_queue.entity';
import { UserDeviceEntity } from 'src/common/entities/user-device.entity';
import { PushController } from './push.controller';
import { PushService } from './push.service';

@Module({
  imports: [TypeOrmModule.forFeature([PushSendQueueEntity, UserDeviceEntity])],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
