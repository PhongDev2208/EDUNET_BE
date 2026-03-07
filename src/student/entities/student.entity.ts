import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'Students' })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  studentId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  school: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  grade: string;

  @Column({ type: 'int', default: 0 })
  totalCoursesEnrolled: number;

  @Column({ type: 'int', default: 0 })
  totalCoursesCompleted: number;

  @Column({ type: 'uuid', name: 'userId' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
