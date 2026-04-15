import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KidProfile } from '../kids/kid.entity';

@Entity('kid_activities')
export class KidActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  kidId: string;

  @ManyToOne(() => KidProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kidId' })
  kid: KidProfile;

  @Column({ type: 'varchar', length: 255 })
  activityName: string;

  @Column({ type: 'varchar', length: 100 })
  activityType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider: string | null;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dayOfWeek: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
