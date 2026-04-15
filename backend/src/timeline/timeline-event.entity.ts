import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KidProfile } from '../kids/kid.entity';
import { User } from '../auth/user.entity';

@Entity('timeline_events')
export class TimelineEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  kidId: string | null;

  @ManyToOne(() => KidProfile, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'kidId' })
  kid: KidProfile | null;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'varchar', length: 255 })
  eventTitle: string;

  @Column({ type: 'varchar', length: 50 })
  eventCategory: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
