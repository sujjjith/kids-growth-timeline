import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { KidsModule } from './kids/kids.module';
import { TimelineModule } from './timeline/timeline.module';
import { EducationModule } from './education/education.module';
import { ActivitiesModule } from './activities/activities.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { CampsModule } from './camps/camps.module';
import { TripsModule } from './trips/trips.module';
import { GrowthModule } from './growth/growth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        ssl:
          config.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    AuthModule,
    KidsModule,
    TimelineModule,
    EducationModule,
    ActivitiesModule,
    CompetitionsModule,
    CampsModule,
    TripsModule,
    GrowthModule,
  ],
})
export class AppModule {}
