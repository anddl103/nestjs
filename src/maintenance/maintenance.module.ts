import { ImagesModule } from './../images/images.module';
import { Module } from '@nestjs/common';
import { MaintenanceController } from './maintenance.controller';

@Module({
  imports: [ImagesModule],
  controllers: [MaintenanceController],
  providers: [],
})
export class MaintenanceModule {}
