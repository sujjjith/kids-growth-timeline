import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthMeasurement } from './growth-measurement.entity';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';
import { TimelineModule } from '../timeline/timeline.module';
import { KidProfile } from '../kids/kid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GrowthMeasurement, KidProfile]),
    TimelineModule,
  ],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}
