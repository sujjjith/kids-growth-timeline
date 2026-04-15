import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { KidsService } from './kids.service';
import { CreateKidDto } from './dto/create-kid.dto';
import { UpdateKidDto } from './dto/update-kid.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('kids')
@UseGuards(JwtAuthGuard)
export class KidsController {
  constructor(private readonly kidsService: KidsService) {}

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.kidsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.kidsService.findOne(id, user.userId);
  }

  @Post()
  create(
    @Body() dto: CreateKidDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.kidsService.create(user.userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateKidDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.kidsService.update(id, user.userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.kidsService.remove(id, user.userId);
  }
}
