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

@Entity('vacation_trips')
export class VacationTrip {
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

  @Column({ type: 'varchar', length: 50 })
  tripType: string;

  @Column({ type: 'varchar', length: 255 })
  tripName: string;

  @Column({ type: 'varchar', length: 255 })
  destination: string;

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
