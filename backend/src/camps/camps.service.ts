import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SummerCamp } from './camp.entity';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';
import { TimelineService } from '../timeline/timeline.service';
import { KidProfile } from '../kids/kid.entity';

@Injectable()
export class CampsService {
  constructor(
    @InjectRepository(SummerCamp)
    private readonly repo: Repository<SummerCamp>,
    @InjectRepository(KidProfile)
    private readonly kidRepo: Repository<KidProfile>,
    private readonly timeline: TimelineService,
  ) {}

  findAll(kidId: string, userId: string): Promise<SummerCamp[]> {
    return this.repo.find({
      where: { kidId, kid: { userId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string, kidId: string, userId: string): Promise<SummerCamp> {
    const record = await this.repo.findOne({
      where: { id, kidId, kid: { userId } },
    });
    if (!record) throw new NotFoundException('Camp not found');
    return record;
  }

  async create(kidId: string, userId: string, dto: CreateCampDto): Promise<SummerCamp> {
    const kid = await this.kidRepo.findOne({ where: { id: kidId, userId } });
    if (!kid) throw new NotFoundException('Kid not found');

    const record = this.repo.create({ ...dto, kidId });
    const saved = await this.repo.save(record);

    await this.timeline.createFromEntity({
      kidId,
      userId,
      eventDate: dto.startDate,
      eventTitle: `Attended ${dto.campName}`,
      eventCategory: 'camp',
      relatedEntityId: saved.id,
    });

    return saved;
  }

  async update(id: string, kidId: string, userId: string, dto: UpdateCampDto): Promise<SummerCamp> {
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
