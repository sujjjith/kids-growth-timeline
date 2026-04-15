import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KidActivity } from './activity.entity';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TimelineModule } from '../timeline/timeline.module';
import { KidProfile } from '../kids/kid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KidActivity, KidProfile]),
    TimelineModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
