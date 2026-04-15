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
import { GrowthService } from './growth.service';
import { CreateGrowthDto } from './dto/create-growth.dto';
import { UpdateGrowthDto } from './dto/update-growth.dto';

@Controller('kids/:kidId/growth')
@UseGuards(JwtAuthGuard)
export class GrowthController {
  constructor(private readonly service: GrowthService) {}

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
    @Body() dto: CreateGrowthDto,
  ) {
    return this.service.create(kidId, user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateGrowthDto,
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
