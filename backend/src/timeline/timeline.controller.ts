import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TimelineService } from './timeline.service';

@Controller('timeline')
@UseGuards(JwtAuthGuard)
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  findAll(
    @CurrentUser() user: { userId: string },
    @Query('kidId') kidId?: string,
    @Query('category') category?: string,
  ) {
    return this.timelineService.findAll(user.userId, kidId, category);
  }
}
