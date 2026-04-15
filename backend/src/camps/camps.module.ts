import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummerCamp } from './camp.entity';
import { CampsService } from './camps.service';
import { CampsController } from './camps.controller';
import { TimelineModule } from '../timeline/timeline.module';
import { KidProfile } from '../kids/kid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SummerCamp, KidProfile]),
    TimelineModule,
  ],
  controllers: [CampsController],
  providers: [CampsService],
  exports: [CampsService],
})
export class CampsModule {}
