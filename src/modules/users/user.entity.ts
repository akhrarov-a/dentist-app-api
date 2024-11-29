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
import { Language, Status, UserRole } from '@core';
import { PatientEntity } from '@patients/patient.entity';
import { AppointmentEntity } from '@appointments/appointment.entity';
import { ServiceEntity } from '@services/service.entity';
import { AppointmentServiceEntity } from '@appointments/appointment-service.entity';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstname: string;

  @Column({ type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  layoutTitle: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  holidays: string[];

  @Column({ type: 'numeric', array: true, nullable: true })
  weekends: number[];

  @Column({ type: 'varchar', length: 255 })
  salt: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: Language, default: Language.RU })
  language: Language;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PatientEntity, (patient) => patient.user, {
    onDelete: 'CASCADE',
  })
  patients: PatientEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user, {
    onDelete: 'CASCADE',
  })
  appointments: AppointmentEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.user, {
    onDelete: 'CASCADE',
  })
  services: ServiceEntity[];

  @OneToMany(
    () => AppointmentServiceEntity,
    (appointmentService) => appointmentService.user,
    {
      onDelete: 'CASCADE',
    },
  )
  appointment_services: AppointmentServiceEntity[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
