import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KidCompetition } from './competition.entity';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { TimelineService } from '../timeline/timeline.service';
import { KidProfile } from '../kids/kid.entity';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(KidCompetition)
    private readonly repo: Repository<KidCompetition>,
    @InjectRepository(KidProfile)
    private readonly kidRepo: Repository<KidProfile>,
    private readonly timeline: TimelineService,
  ) {}

  findAll(kidId: string, userId: string): Promise<KidCompetition[]> {
    return this.repo.find({
      where: { kidId, kid: { userId } },
      order: { eventDate: 'DESC' },
    });
  }

  async findOne(id: string, kidId: string, userId: string): Promise<KidCompetition> {
    const record = await this.repo.findOne({
      where: { id, kidId, kid: { userId } },
    });
    if (!record) throw new NotFoundException('Competition not found');
    return record;
  }

  async create(kidId: string, userId: string, dto: CreateCompetitionDto): Promise<KidCompetition> {
    const kid = await this.kidRepo.findOne({ where: { id: kidId, userId } });
    if (!kid) throw new NotFoundException('Kid not found');

    const record = this.repo.create({ ...dto, kidId });
    const saved = await this.repo.save(record);

    await this.timeline.createFromEntity({
      kidId,
      userId,
      eventDate: dto.eventDate,
      eventTitle: `Competed in ${dto.competitionName}`,
      eventCategory: 'competition',
      relatedEntityId: saved.id,
    });

    return saved;
  }

  async update(id: string, kidId: string, userId: string, dto: UpdateCompetitionDto): Promise<KidCompetition> {
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
