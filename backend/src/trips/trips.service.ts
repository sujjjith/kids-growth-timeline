import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationTrip } from './trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TimelineService } from '../timeline/timeline.service';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(VacationTrip)
    private readonly repo: Repository<VacationTrip>,
    private readonly timeline: TimelineService,
  ) {}

  findAll(userId: string): Promise<VacationTrip[]> {
    return this.repo.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<VacationTrip> {
    const record = await this.repo.findOne({
      where: { id, userId },
    });
    if (!record) throw new NotFoundException('Trip not found');
    return record;
  }

  async create(userId: string, dto: CreateTripDto): Promise<VacationTrip> {
    const record = this.repo.create({ ...dto, userId });
    const saved = await this.repo.save(record);

    await this.timeline.createFromEntity({
      kidId: dto.kidId ?? null,
      userId,
      eventDate: dto.startDate,
      eventTitle: `Trip to ${dto.destination}`,
      eventCategory: 'trip',
      relatedEntityId: saved.id,
    });

    return saved;
  }

  async update(id: string, userId: string, dto: UpdateTripDto): Promise<VacationTrip> {
    const record = await this.findOne(id, userId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findOne(id, userId);
    await this.timeline.removeByRelatedEntity(record.id);
    await this.repo.remove(record);
  }
}
