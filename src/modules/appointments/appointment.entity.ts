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
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@users/user.entity';
import { PatientEntity } from '@patients/patient.entity';
import { AppointmentServiceEntity } from './appointment-service.entity';

@Entity('appointments')
export class AppointmentEntity extends BaseEntity {
  @ApiProperty({ description: 'The id of the appointment' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Start time of the appointment' })
  @Column()
  start_time: Date;

  @ApiProperty({ description: 'End time of the appointment' })
  @Column()
  end_time: Date;

  @ApiProperty({
    description: 'Description of the appointment',
    nullable: true,
  })
  @Column()
  description: string;

  @ApiProperty({ description: 'Created at time of the appointment' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Updated at time of the appointment' })
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
