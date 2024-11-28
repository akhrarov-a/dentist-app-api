import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { PatientEntity } from '@patients/patient.entity';
import { AppointmentServiceEntity } from './appointment-service.entity';

@Entity('appointments')
export class AppointmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PatientEntity, (patient) => patient.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @OneToMany(
    () => AppointmentServiceEntity,
    (appointmentService) => appointmentService.appointment,
    {
      onDelete: 'CASCADE',
    },
  )
  appointmentServices: AppointmentServiceEntity[];
}
