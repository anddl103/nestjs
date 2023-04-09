import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CodesModule } from './codes/codes.module';
import { CouponsModule } from './coupons/coupons.module';
import { HomeModule } from './home/home.module';
import { ImagesModule } from './images/images.module';
import { MenuGroupsModule } from './menu-groups/menu-groups.module';
import { MenusModule } from './menus/menus.module';
import { OptionGroupsModule } from './option-groups/option-groups.module';
import { OptionsModule } from './options/options.module';
import { OwnersModule } from './owners/owners.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { PushModule } from './push/push.module';
import { FcmModule } from './fcm/fcm.module';
import { JobModule } from './job/job.module';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { EventsModule } from './events/events.module';
import { NoticesModule } from './notices/notices.module';
import { QuestionsModule } from './questions/questions.module';
import { PosModule } from './pos/pos.module';
import { PaymentSnapshotsModule } from './payment-snapshots/payment-snapshots.module';
import { PaymentModule } from './payment/payment.module';
import { CategoriesModule } from './categories/categories.module';
import { SettlementModule } from './settlement/settlement.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { BannerModule } from './banner/banner.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [],
    synchronize: false,
    autoLoadEntities: true,
    logging: true,
    keepConnectionAlive: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: Joi.number(),
        SECRET_KEY: Joi.string().required(),
        SWAGGER_USER: Joi.string().required(),
        SWAGGER_PASSWORD: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    CodesModule,
    CouponsModule,
    HomeModule,
    ImagesModule,
    MenuGroupsModule,
    MenusModule,
    OptionGroupsModule,
    OptionsModule,
    OwnersModule,
    StoresModule,
    UsersModule,
    PushModule,
    FcmModule.forRoot({
      firebaseSpecsPath: path.join(__dirname, '../firebase.spec.json'),
    }),
    ScheduleModule.forRoot(),
    JobModule,
    MailModule,
    EventsModule,
    NoticesModule,
    QuestionsModule,
    PosModule,
    PaymentSnapshotsModule,
    PaymentModule,
    CategoriesModule,
    SettlementModule,
    MaintenanceModule,
    BannerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
