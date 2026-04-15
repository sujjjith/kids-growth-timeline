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
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('kids/:kidId/activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  findAll(
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.findAll(kidId, user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.findOne(id, kidId, user.userId);
  }

  @Post()
  create(
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateActivityDto,
  ) {
    return this.service.create(kidId, user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateActivityDto,
  ) {
    return this.service.update(id, kidId, user.userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.remove(id, kidId, user.userId);
  }
}
