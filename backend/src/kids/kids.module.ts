import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KidProfile } from './kid.entity';
import { KidsService } from './kids.service';
import { KidsController } from './kids.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KidProfile])],
  controllers: [KidsController],
  providers: [KidsService],
  exports: [KidsService],
})
export class KidsModule {}
