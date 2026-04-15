import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineEvent } from './timeline-event.entity';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimelineEvent])],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
