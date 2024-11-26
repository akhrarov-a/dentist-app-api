import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@users/user.entity';

@Entity('appointments')
export class AppointmentEntity extends BaseEntity {
  @ApiProperty({ description: 'ID of the appointment' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Selected patient for the appointment' })
  @Column()
  patientId: number;

  @ApiProperty({ description: 'Selected service for the appointment' })
  @Column()
  serviceId: number;

  @ApiProperty({ description: 'Start time of the appointment' })
  @Column()
  startTime: Date;

  @ApiProperty({ description: 'End time of the appointment' })
  @Column()
  endTime: Date;

  @ApiProperty({ description: 'Description of the appointment' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Created at time of the appointment' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at time of the appointment' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.appointments, { eager: false })
  user: UserEntity;

  @ApiProperty({ description: 'The owner of the appointment' })
  @Column()
  userId: number;
}
