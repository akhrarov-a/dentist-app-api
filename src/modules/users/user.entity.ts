import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Status } from '@core';
import { PatientEntity } from '@patients/patient.entity';
import { AppointmentEntity } from '@appointments/appointment.entity';
import { ServiceEntity } from '@services/service.entity';
import { UserRole } from './types';

@Entity('users')
@Unique(['email'])
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
  salt: string;

  @Column()
  role: UserRole;

  @Column()
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PatientEntity, (patient) => patient.user, { eager: true })
  patients: PatientEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user, {
    eager: true,
  })
  appointments: AppointmentEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.user, {
    eager: true,
  })
  services: ServiceEntity[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
