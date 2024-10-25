import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRole } from './types';

@Entity('users')
@Unique(['email', 'phone'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
