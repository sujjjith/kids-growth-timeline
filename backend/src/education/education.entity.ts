import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KidProfile } from '../kids/kid.entity';

@Entity('education_records')
export class EducationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  kidId: string;

  @ManyToOne(() => KidProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kidId' })
  kid: KidProfile;

  @Column({ type: 'varchar', length: 255 })
  schoolName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  grade: string | null;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  achievement: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
