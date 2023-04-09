import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeEntity } from 'src/common/entities/code.entity';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { TreeRepository } from 'typeorm';
import { TreeEntity } from 'src/common/entities/tree.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodeEntity]),
    TypeOrmModule.forFeature([TreeEntity]),
  ],
  controllers: [CodesController],
  providers: [CodesService],
  exports: [CodesService],
})
export class CodesModule {}
