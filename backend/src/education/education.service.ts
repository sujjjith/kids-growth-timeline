import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationRecord } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { TimelineService } from '../timeline/timeline.service';
import { KidProfile } from '../kids/kid.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationRecord)
    private readonly repo: Repository<EducationRecord>,
    @InjectRepository(KidProfile)
    private readonly kidRepo: Repository<KidProfile>,
    private readonly timeline: TimelineService,
  ) {}

  findAll(kidId: string, userId: string): Promise<EducationRecord[]> {
    return this.repo.find({
      where: { kidId, kid: { userId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string, kidId: string, userId: string): Promise<EducationRecord> {
    const record = await this.repo.findOne({
      where: { id, kidId, kid: { userId } },
    });
    if (!record) throw new NotFoundException('Education record not found');
    return record;
  }

  async create(kidId: string, userId: string, dto: CreateEducationDto): Promise<EducationRecord> {
    const kid = await this.kidRepo.findOne({ where: { id: kidId, userId } });
    if (!kid) throw new NotFoundException('Kid not found');

    const record = this.repo.create({ ...dto, kidId });
    const saved = await this.repo.save(record);

    await this.timeline.createFromEntity({
      kidId,
      userId,
      eventDate: dto.startDate,
      eventTitle: `Started at ${dto.schoolName}`,
      eventCategory: 'education',
      relatedEntityId: saved.id,
    });

    return saved;
  }

  async update(id: string, kidId: string, userId: string, dto: UpdateEducationDto): Promise<EducationRecord> {
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
