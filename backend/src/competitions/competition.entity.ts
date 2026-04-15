import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KidProfile } from '../kids/kid.entity';

@Entity('kid_competitions')
export class KidCompetition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  kidId: string;

  @ManyToOne(() => KidProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kidId' })
  kid: KidProfile;

  @Column({ type: 'varchar', length: 255 })
  competitionName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  competitionType: string | null;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  result: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  placement: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
