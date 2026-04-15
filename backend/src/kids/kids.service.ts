import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KidProfile } from './kid.entity';
import { CreateKidDto } from './dto/create-kid.dto';
import { UpdateKidDto } from './dto/update-kid.dto';

@Injectable()
export class KidsService {
  constructor(
    @InjectRepository(KidProfile)
    private readonly kidRepo: Repository<KidProfile>,
  ) {}

  findAll(userId: string): Promise<KidProfile[]> {
    return this.kidRepo.find({
      where: { userId },
      order: { firstName: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<KidProfile> {
    const kid = await this.kidRepo.findOne({ where: { id, userId } });
    if (!kid) throw new NotFoundException('Kid not found');
    return kid;
  }

  async create(userId: string, dto: CreateKidDto): Promise<KidProfile> {
    const kid = this.kidRepo.create({ ...dto, userId });
    return this.kidRepo.save(kid);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateKidDto,
  ): Promise<KidProfile> {
    const kid = await this.findOne(id, userId);
    Object.assign(kid, dto);
    return this.kidRepo.save(kid);
  }

  async remove(id: string, userId: string): Promise<void> {
    const kid = await this.findOne(id, userId);
    await this.kidRepo.remove(kid);
  }
}
