import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KidProfile } from '../kids/kid.entity';

@Entity('summer_camps')
export class SummerCamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  kidId: string;

  @ManyToOne(() => KidProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kidId' })
  kid: KidProfile;

  @Column({ type: 'varchar', length: 255 })
  campName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  campType: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text', nullable: true })
  highlights: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
