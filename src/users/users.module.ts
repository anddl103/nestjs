import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserEntity } from '../common/entities/users.entity';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OwnersModule } from '../owners/owners.module';
import { UserAddressEntity } from '../common/entities/user-addresses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserAddressEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRES_IN'),
        },
      }),
    }),
    OwnersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
