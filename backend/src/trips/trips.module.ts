import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationTrip } from './trip.entity';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TimelineModule } from '../timeline/timeline.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VacationTrip]),
    TimelineModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
