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
import { CampsService } from './camps.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';

@Controller('kids/:kidId/camps')
@UseGuards(JwtAuthGuard)
export class CampsController {
  constructor(private readonly service: CampsService) {}

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
    @Body() dto: CreateCampDto,
  ) {
    return this.service.create(kidId, user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateCampDto,
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
