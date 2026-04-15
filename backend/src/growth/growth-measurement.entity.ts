import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KidProfile } from '../kids/kid.entity';

@Entity('growth_measurements')
export class GrowthMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  kidId: string;

  @ManyToOne(() => KidProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kidId' })
  kid: KidProfile;

  @Column({ type: 'date' })
  measurementDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heightInches: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weightLbs: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
