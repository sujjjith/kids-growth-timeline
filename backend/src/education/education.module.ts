import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationRecord } from './education.entity';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { TimelineModule } from '../timeline/timeline.module';
import { KidProfile } from '../kids/kid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EducationRecord, KidProfile]),
    TimelineModule,
  ],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
