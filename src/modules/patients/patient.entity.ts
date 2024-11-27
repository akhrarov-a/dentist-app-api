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
import { Status } from '@core';
import { UserEntity } from '@users/user.entity';
import { AppointmentEntity } from '@appointments/appointment.entity';

@Entity('patients')
export class PatientEntity extends BaseEntity {
  @ApiProperty({ description: 'The id of the patient' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The firstname of the patient' })
  @Column({ type: 'varchar', length: 255 })
  firstname: string;

  @ApiProperty({ description: 'The lastname of the patient', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname: string;

  @ApiProperty({ description: 'The phone of the patient' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'The email of the patient' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({
    description: 'The description of the patient',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @ApiProperty({ description: 'Created date and time of the patient' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Updated date and time of the patient' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.patients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.patient, {
    onDelete: 'CASCADE',
  })
  appointments: AppointmentEntity[];
}
