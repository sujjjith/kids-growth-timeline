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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.service.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.findOne(id, user.userId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateTripDto,
  ) {
    return this.service.create(user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateTripDto,
  ) {
    return this.service.update(id, user.userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.remove(id, user.userId);
  }
}
