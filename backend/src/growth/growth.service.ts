import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthMeasurement } from './growth-measurement.entity';
import { CreateGrowthDto } from './dto/create-growth.dto';
import { UpdateGrowthDto } from './dto/update-growth.dto';
import { TimelineService } from '../timeline/timeline.service';
import { KidProfile } from '../kids/kid.entity';

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(GrowthMeasurement)
    private readonly repo: Repository<GrowthMeasurement>,
    @InjectRepository(KidProfile)
    private readonly kidRepo: Repository<KidProfile>,
    private readonly timeline: TimelineService,
  ) {}

  findAll(kidId: string, userId: string): Promise<GrowthMeasurement[]> {
    return this.repo.find({
      where: { kidId, kid: { userId } },
      order: { measurementDate: 'DESC' },
    });
  }

  async findOne(id: string, kidId: string, userId: string): Promise<GrowthMeasurement> {
    const record = await this.repo.findOne({
      where: { id, kidId, kid: { userId } },
    });
    if (!record) throw new NotFoundException('Growth measurement not found');
    return record;
  }

  async create(kidId: string, userId: string, dto: CreateGrowthDto): Promise<GrowthMeasurement> {
    const kid = await this.kidRepo.findOne({ where: { id: kidId, userId } });
    if (!kid) throw new NotFoundException('Kid not found');

    const record = this.repo.create({ ...dto, kidId });
    const saved = await this.repo.save(record);

    const parts: string[] = [];
    if (dto.heightInches) parts.push(`${dto.heightInches}" tall`);
    if (dto.weightLbs) parts.push(`${dto.weightLbs} lbs`);

    await this.timeline.createFromEntity({
      kidId,
      userId,
      eventDate: dto.measurementDate,
      eventTitle: `Growth check: ${parts.join(', ') || 'recorded'}`,
      eventCategory: 'growth',
      relatedEntityId: saved.id,
    });

    return saved;
  }

  async update(id: string, kidId: string, userId: string, dto: UpdateGrowthDto): Promise<GrowthMeasurement> {
    const record = await this.findOne(id, kidId, userId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string, kidId: string, userId: string): Promise<void> {
    const record = await this.findOne(id, kidId, userId);
    await this.timeline.removeByRelatedEntity(record.id);
    await this.repo.remove(record);
  }
}
