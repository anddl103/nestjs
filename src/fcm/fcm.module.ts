import {
  DynamicModule,
  Global,
  Logger,
  Module,
  ValueProvider,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushHistoryEntity } from 'src/common/entities/push-history.entity';
import { FcmService } from './fcm.service';
import { FcmOptions } from './interfaces/fcm-options.interface';

@Global()
@Module({})
export class FcmModule {
  static forRoot(options: FcmOptions): DynamicModule {
    const optionsProvider: ValueProvider = {
      provide: 'FcmOptions',
      useValue: options,
    };
    const logger = options.logger ? options.logger : new Logger('FcmService');
    return {
      module: FcmModule,
      imports: [TypeOrmModule.forFeature([PushHistoryEntity])],
      providers: [
        { provide: Logger, useValue: logger },
        FcmService,
        optionsProvider,
      ],
      exports: [FcmService],
    };
  }
}
