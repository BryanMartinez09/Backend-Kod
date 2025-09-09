// src/bootcamps/bootcamps.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bootcamp } from './entities/bootcamp.entity';
import { BootcampsService } from './bootcamps.service';
import { BootcampsController } from './bootcamps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bootcamp])],
  providers: [BootcampsService],
  controllers: [BootcampsController],
})
export class BootcampsModule {}
