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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Controller('kids/:kidId/education')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly service: EducationService) {}

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
    @Body() dto: CreateEducationDto,
  ) {
    return this.service.create(kidId, user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('kidId', ParseUUIDPipe) kidId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateEducationDto,
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
