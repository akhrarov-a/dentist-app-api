import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientEntity } from '@patients/patient.entity';

export class AppointmentResponseWithPatientDto {
  @ApiProperty({ description: 'ID of the appointment' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Selected patient for the appointment',
    type: PatientEntity,
  })
  @Column()
  patient: PatientEntity;

  @ApiProperty({ description: 'Start time of the appointment' })
  @Column()
  startTime: Date;

  @ApiProperty({ description: 'End time of the appointment' })
  @Column()
  endTime: Date;

  @ApiProperty({
    description: 'Description of the appointment',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Created at time of the appointment' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at time of the appointment' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'The owner of the appointment' })
  @Column()
  userId: number;
}
