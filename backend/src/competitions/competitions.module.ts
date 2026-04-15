import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KidCompetition } from './competition.entity';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { TimelineModule } from '../timeline/timeline.module';
import { KidProfile } from '../kids/kid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KidCompetition, KidProfile]),
    TimelineModule,
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [CompetitionsService],
})
export class CompetitionsModule {}
