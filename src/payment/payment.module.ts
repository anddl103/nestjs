import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { IamportPaymentEntity } from '../common/entities/iamport-payment.entity';
import { IamportPaymentCancelEntity } from '../common/entities/iamport-payment-cancel.entity';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('IMP_BASE_URL'),
        timeout: configService.get('IMP_TIMEOUT'),
        maxRedirects: configService.get('IMP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      IamportPaymentEntity,
      IamportPaymentCancelEntity,
    ]),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
