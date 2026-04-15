import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimelineEvent } from './timeline-event.entity';

export interface CreateTimelineEventInput {
  kidId?: string | null;
  userId: string;
  eventDate: Date | string;
  eventTitle: string;
  eventCategory: string;
  description?: string | null;
  relatedEntityId?: string | null;
}

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(TimelineEvent)
    private readonly repo: Repository<TimelineEvent>,
  ) {}

  findAll(userId: string, kidId?: string, category?: string): Promise<TimelineEvent[]> {
    const qb = this.repo.createQueryBuilder('te')
      .where('te.userId = :userId', { userId })
      .orderBy('te.eventDate', 'DESC');

    if (kidId) qb.andWhere('te.kidId = :kidId', { kidId });
    if (category) qb.andWhere('te.eventCategory = :category', { category });

    return qb.getMany();
  }

  createFromEntity(input: CreateTimelineEventInput): Promise<TimelineEvent> {
    const event = this.repo.create({
      kidId: input.kidId ?? null,
      userId: input.userId,
      eventDate: input.eventDate instanceof Date ? input.eventDate : new Date(input.eventDate),
      eventTitle: input.eventTitle,
      eventCategory: input.eventCategory,
      description: input.description ?? null,
      relatedEntityId: input.relatedEntityId ?? null,
    });
    return this.repo.save(event);
  }

  async removeByRelatedEntity(relatedEntityId: string): Promise<void> {
    await this.repo.delete({ relatedEntityId });
  }
}
